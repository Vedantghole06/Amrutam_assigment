const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { lockSlot, confirmBooking } = require('../controllers/bookingController');

router.post('/lock', protect, lockSlot);
router.post('/confirm', protect, confirmBooking);

module.exports = router;
