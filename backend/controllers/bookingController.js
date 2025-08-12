const SlotLock = require('../models/SlotLock');
const Appointment = require('../models/Appointment');

// Step 1: Lock slot
exports.lockSlot = async (req, res) => {
    const { doctorId, date, time } = req.body;
    const patientId = req.user._id;

    try {
        const lock = new SlotLock({ doctor: doctorId, date, time, patient: patientId });
        await lock.save();
        res.json({ message: 'Slot locked. Confirm within 5 minutes.' });
    } catch (err) {
        res.status(400).json({ message: 'Slot already locked or booked.' });
    }
};

// Step 2: Confirm booking after mock OTP
exports.confirmBooking = async (req, res) => {
    const { doctorId, date, time } = req.body;
    const patientId = req.user._id;

    try {
        const lock = await SlotLock.findOne({ doctor: doctorId, date, time, patient: patientId });
        if (!lock) return res.status(400).json({ message: 'Slot lock not found or expired.' });

        const appointment = new Appointment({
            doctor: doctorId,
            patient: patientId,
            date,
            time,
            status: 'Booked'
        });
        await appointment.save();

        // Remove lock after booking
        await SlotLock.deleteOne({ _id: lock._id });

        res.json({ message: 'Booking confirmed', appointment });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
