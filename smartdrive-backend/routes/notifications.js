const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');
const sgMail = require('@sendgrid/mail');
const { supabase } = require('../lib/supabaseClient'); // Import Supabase client
require('dotenv').config();

const router = express.Router();
const accountsId = process.env.TWILIO_ACCOUNT_ID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const sendGridApiKey = process.env.SENDGRID_API_KEY;
const client = twilio(accountsId, authToken);
sgMail.setApiKey(sendGridApiKey);

router.use(bodyParser.urlencoded({ extended: false }));

router.post('/send-notification', async (req, res) => {
    const { userId, to, body, type } = req.body; 
    
    try {
        const { data: preferences, error } = await supabase
            .from('user_preferences')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error || !preferences) {
            return res.status(404).send('User preferences not found');
        }

        if (type === 'sms' && preferences.sms_opt_in) {
            await client.messages.create({
                body: body,
                to: to,
                from: '+16062685998'
            });
            return res.send('SMS has been sent successfully!');
        } else if (type === 'email' && preferences.email_opt_in) {
            const msg = {
                to: to,
                from: 'raashid.arq+user1@gmail.com',
                subject: 'Notification',
                text: body,
            };
            await sgMail.send(msg);
            return res.send('Email has been sent successfully!');
        } else {
            return res.status(403).send('User has opted out of this notification type');
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send('Error sending notification');
    }
});

module.exports = router;
