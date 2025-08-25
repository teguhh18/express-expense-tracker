const nodemailer = require("nodemailer");

const emailManager = async (to, subject, text) => {
  // Looking to send emails in production? Check out our Email API/SMTP product!
  var transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "53cd6415b91f44",
      pass: "ceb0808ef4f393",
    },
  });

 await transport.sendMail({
    to: to,
    from: "info@expense.com",
    subject: subject,
    text: text,
  });
};

module.exports = emailManager;
