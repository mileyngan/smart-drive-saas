const express = require('express');
const { supabase } = require('../lib/supabaseClient');
const router = express.Router();

router.post('/', async (req, res) => {
    const { email, password, fullName, phoneNumber } = req.body;

    try {

        const { user, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
        });

        if (signUpError) {
            console.error('Sign-Up Error', signUpError)
            return res.status(400).json({ message: signUpError.message });
        }

        // Check if user is defined
        if (!user || !user.id) {
           return res.status(400).json({ message: 'User creation failed, please try again.' });
        }
        const { error: profileError } = await supabase
            .from('profiles')
            .insert([{
                id: user.id,
                full_name: fullName,
                email: email,
                phone: phoneNumber,
                role: 'student', // default role
            }]);    

        if (profileError) {
            console.error('Profile Insertion Error:', profileError);
            return res.status(400).json({ message: profileError.message });
        }

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Internal server error', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
