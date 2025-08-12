const mongoose = require('mongoose');

const slotLockSchema = new mongoose.Schema({
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now, expires: 300 } // auto-delete after 5 min
});

slotLockSchema.index({ doctor: 1, date: 1, time: 1 }, { unique: true });

module.exports = mongoose.model('SlotLock', slotLockSchema);
