const sgMail = require('@sendgrid/mail');

// Configure API key to Sendgrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Send welcome mail
const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'brianbawuah@icloud.com',
    subject: 'Thanks for joining the Tasksy family!',
    text: `Welcome ${name}. If you have any questions or tips, please don't hesitate to contact me.`,
  });
};

// Send goodbye mail
const sendGoodbyeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'brianbawuah@icloud.com',
    subject: 'Thanks for using Tasksy!',
    text: `Do you have feedback for us ${name}?`,
  });
};

// Export de functions
module.exports = {
  sendWelcomeEmail,
  sendGoodbyeEmail,
};
