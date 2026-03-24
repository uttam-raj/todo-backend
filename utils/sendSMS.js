const twilio = require("twilio");

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromPhone = process.env.TWILIO_PHONE;

const client = twilio(accountSid, authToken);

const sendSMS = async (to, message) => {
  try {
    await client.messages.create({
      body: message,
      from: fromPhone,
      to: to, // e.g., '+919693486779'
    });

    console.log("SMS sent successfully");
  } catch (error) {
    console.error("SMS not sent:", error);
  }
};

module.exports = sendSMS;
