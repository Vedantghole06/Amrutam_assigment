const Appointment = require('../models/Appointment');

// @desc    Get user appointments (patient view)
// @route   GET /api/appointments/me
// @access  Private
exports.getMyAppointments = async (req, res) => {
    try {
        const { status } = req.query;
        const filter = { patient: req.user._id };
        if (status) filter.status = status;

        const appointments = await Appointment.find(filter)
            .populate('doctor', 'specialization mode')
            .populate({ path: 'doctor', populate: { path: 'user', select: 'name email' } })
            .sort({ date: 1 });

        res.json(appointments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
