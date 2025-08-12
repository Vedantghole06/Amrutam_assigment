const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { lockSlot, confirmBooking, rescheduleAppointment, cancelAppointment } = require('../controllers/bookingController');

router.post('/lock', protect, lockSlot);
router.post('/confirm', protect, confirmBooking);
router.put('/reschedule', protect, rescheduleAppointment);
router.put('/cancel', protect, cancelAppointment);

module.exports = router;



