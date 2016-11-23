const config = require('./main');
const helper = require('sendgrid').mail;

const fromEmail = new helper.Email('info@yourdomain.com');
const sg = require('sendgrid')(config.sendgridApiKey);

// Create and export function to send emails through Mailgun API
exports.sendEmail = function sendEmail(recipient, message) {
  const toEmail = new helper.Email(recipient);
  const content = new helper.Content('text/plain', message.text);
  const mail = new helper.Mail(fromEmail, message.subject, toEmail, content);
  const request = sg.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: mail.toJSON()
  });
  sg.API(request, (error, response) => {
    console.log(response.statusCode);
    console.log(response.body);
    console.log(response.headers);
  });
};
