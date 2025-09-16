const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');
require('dotenv').config();

const router = express.Router();
const accountsId = process.env.TWILIO_ACCOUNT_ID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountsId, authToken);

router.use(bodyParser.urlencoded({ extended: false }));

router.post('/send-sms', (req, res) => {
    const { to, body } = req.body;

    client.messages.create({
        body: body,
        to: to,
        from: '+16062685998'
    })
    .then(() => {
        res.send('SMS has been sent successfully!');
    })
    .catch((err) => {
        console.log(err);
        res.status(500).send('Error sending SMS');
    });
});

module.exports = router;
