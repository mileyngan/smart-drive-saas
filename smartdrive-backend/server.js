const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const smsRoutes = require('./routes/sms');
const registerRoutes = require('./routes/register');
app.use('/api/login', require('./routes/login'));

app.use('/api/sms', smsRoutes);
/*app.use('/api/register', registerRoutes);*/
app.use('/api/profile', require('./routes/profile'));
app.use('/api/schools', require('./routes/schools'));
app.use('/api/users', require('./routes/users'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
