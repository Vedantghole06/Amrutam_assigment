const Doctor = require('../models/Doctor');


exports.getDoctors = async (req, res) => {
    try {
        const { specialization, mode, date } = req.query;

        let filter = {};
        if (specialization) filter.specialization = specialization;
        if (mode) filter.mode = mode;

        // Fetch doctors based on specialization/mode
        let doctors = await Doctor.find(filter).populate('user', 'name email');

        // Filter availability if date is provided
        if (date) {
            const targetDate = new Date(date);
            doctors = doctors.filter(doc =>
                doc.availability.some(av => av.date.toDateString() === targetDate.toDateString())
            );
        }

        // Sort by soonest availability
        doctors.sort((a, b) => {
            const nextA = a.availability.map(av => av.date).sort()[0];
            const nextB = b.availability.map(av => av.date).sort()[0];
            return new Date(nextA) - new Date(nextB);
        });

        res.json(doctors);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
