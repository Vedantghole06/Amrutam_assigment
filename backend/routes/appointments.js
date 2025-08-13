const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { getMyAppointments } = require('../controllers/appointmentController');

router.get('/me', protect, getMyAppointments);

module.exports = router;
