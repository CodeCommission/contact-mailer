const AWS = require('aws-sdk');
const {compose, json, cors} = require('linklet');

console.log(`AWS_KEY: ${process.env.AWS_KEY}`);
console.log(`AWS_SECRET: ${process.env.AWS_SECRET}`);

module.exports = compose(cors({}))(handler);

async function handler (req, res) {
  const {name, email, message, subject, to} = await json(req);

  const ses = new AWS.SES({
    accessKeyId: process.env.AWS_KEY,
    secretAccessKey: process.env.AWS_SECRET,
    region: 'eu-west-1',
  });

  return await ses.sendEmail({
    Source: process.env.EMAIL_FROM_ADDRESS || 'Code Commission <go@codecommission.com>',
    Destination: {ToAddresses:[to || 'mike@mikebild.com']},
    ReturnPath: process.env.EMAIL_FROM_ADDRESS || 'Code Commission <go@codecommission.com>',
    ReplyToAddresses: ['Code Commission <go@codecommission.com>'],
    Message: {
      Subject: {Data: subject || 'Contact from Code Commission WebSite'},
      Body: {Text:{Data: `${name} ${email}: ${message}`}},
    }
  })
  .promise()
  .then(() => ({message: 'success'}))
  .catch(error => {
    console.log(error)
    return {message: 'failure'}
  });
}