const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
    date: { type: Date, required: true },
    slots: [{ time: String, isBooked: { type: Boolean, default: false } }]
});

const DoctorSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Link to User model
    specialization: { type: String, required: true },
    mode: { type: String, enum: ['online', 'in-person', 'both'], default: 'online' },
    experience: { type: Number, default: 0 }, // in years
    location: { type: String }, // for in-person
    availability: [availabilitySchema]
}, { timestamps: true });

DoctorSchema.index({ specialization: 1, mode: 1 }); // For fast filtering

module.exports = mongoose.model('Doctor', DoctorSchema);
