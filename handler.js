'use strict';
require('dotenv').config()
const AWS = require('aws-sdk');
const lambda = new AWS.Lambda({
  region: "us-east-2"
});
const uuid = require('uuid');

function makeResponse(responde, statusCode = 200, message = '', error = {} ) {
  const status = error && error.statusCode || statusCode
  const result = error && error.statusCode ? false : true
  return {
    statusCode: status,    
    body: JSON.stringify({
      result,
      data: responde,
      message
    })
  }
}

module.exports.firstLambda = async (event, context) => {
  const data = typeof event.body === 'string' ? JSON.parse(event.body) : event;
  // const {company, status, observation} = data
  const product_id = uuid.v1();
  const status_created_at = new Date().getTime();
  
  const params = {
    FunctionName: "serverless-sns-dev-secondLambda",
    InvocationType: "Event",
    Payload: JSON.stringify({ data: "message_string" }),
  };

  lambda.invoke(params, function(error, data) {
    if (error) {
      console.error(JSON.stringify(error));
    }else{
      console.log('success', data);
    }
  });

  return makeResponse(data, 200)
};

module.exports.secondLambda = async (event, context, callback) => {
  const sns = new AWS.SNS();
  const accountId =  process.env.AWS_ACCOUNT_ID;  
  const params = {
    Message: 'triggering other Lambda(s)',
    TopicArn: `arn:aws:sns:us-east-2:${accountId}:dispatcher`
  };
  console.log('event', event)
  console.log('process', process.env.AWS_ACCOUNT_ID)
  sns.publish(params, (error, data) => {
    if (error) {
      callback(error);
    }
    callback(null, { message: 'Message successfully published to SNS topic "dispatcher"', event });
  });
};

module.exports.thirdLambda = (event, context, callback) => {
  // print out the event information on the console (so that we can see it in the CloudWatch logs)
  console.log(
    `I'm triggered by "secondLambda" through the SNS topic "dispatcher":\n${JSON.stringify(
      event,
      null,
      2
    )}`
  );

  callback(null, { event });
};

