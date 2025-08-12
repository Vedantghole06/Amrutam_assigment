const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    status: { type: String, enum: ['Booked', 'Completed', 'Cancelled'], default: 'Booked' }
}, { timestamps: true });

appointmentSchema.index({ doctor: 1, date: 1, time: 1 }); // fast conflict check

module.exports = mongoose.model('Appointment', appointmentSchema);
