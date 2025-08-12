const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Import routes (to be added later)
app.use('/api/auth', require('./routes/auth'));
// app.use('/api/doctors', require('./routes/doctors'));
// app.use('/api/appointments', require('./routes/appointments'));

// Health check
app.get('/', (req, res) => res.send('API running'));

module.exports = app;
