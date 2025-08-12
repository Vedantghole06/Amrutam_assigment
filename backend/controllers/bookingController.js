const SlotLock = require('../models/SlotLock');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');

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


// Reschedule appointment (>24h rule)
exports.rescheduleAppointment = async (req, res) => {
    const { appointmentId, newDate, newTime } = req.body;
    const patientId = req.user._id;

    try {
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

        // Ensure patient owns the appointment
        if (appointment.patient.toString() !== patientId.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Check 24-hour rule
        const now = new Date();
        if (new Date(appointment.date).getTime() - now.getTime() <= 24 * 60 * 60 * 1000) {
            return res.status(400).json({ message: 'Cannot reschedule within 24 hours of appointment' });
        }

        // Update appointment date/time
        appointment.date = newDate;
        appointment.time = newTime;
        await appointment.save();

        res.json({ message: 'Appointment rescheduled', appointment });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Cancel appointment (frees slot)
exports.cancelAppointment = async (req, res) => {
    const { appointmentId } = req.body;
    const patientId = req.user._id;

    try {
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

        if (appointment.patient.toString() !== patientId.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        if (appointment.status === 'Cancelled') {
            return res.status(400).json({ message: 'Already cancelled' });
        }

        appointment.status = 'Cancelled';
        await appointment.save();

        res.json({ message: 'Appointment cancelled', appointment });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
