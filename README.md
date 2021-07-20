# Serverless Lambda

Serverless service which shows how one can chain Lambdas through SNS.
The [configuration](https://serverless.com/framework/docs/providers/aws/events/sns/#sns) which triggers the chain mechanims is defined on [serverless.yml](/serverless.yml). 

## Installation

Make sure that you use Serverless v1.

1. Next up cd into the service with `cd serverless-sns`
2. Run `npm install`
3. Search your accountId with: aws sts get-caller-identity
4. Replace the `accountId` in the `.env` file with your AWS account id
5. Deploy with `serverless deploy`

## Test

1. Run `serverless invoke -f firstLambda` to trigger the chaining process (this will call a lamnda function `secondLambda` who publish a message to the SNS topic called `dispatcher` the `thirdLambda` will listen to)
2. Run `serverless logs -f firstLambda -t` to see that the message which was send to the `dispatcher` topic successfully triggered the `secondLambda` function
3. Run `serverless logs -f secondLambda -t` to see that the message which was send to the `dispatcher` topic successfully triggered the `secondLambda` function
4. Run `serverless logs -f thirdLambda -t` to see that the message which was send to the `dispatcher` topic successfully triggered the `thirdLambda` function

## AWS services used

- Lambda
- SNS

## References
https://serverless.com/framework/docs/providers/aws/events/sns/#sns
