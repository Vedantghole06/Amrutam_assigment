import React, { useState } from 'react';
import axios from 'axios';

const BookSlot = ({ doctorId, date, time }) => {
    const [status, setStatus] = useState('');
    const token = localStorage.getItem('token');

    const handleLock = async () => {
        try {
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/bookings/lock`,
                { doctorId, date, time },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setStatus('Locked. Please confirm with OTP within 5 minutes.');
        } catch (err) {
            setStatus(err.response?.data?.message || 'Error locking slot');
        }
    };

    const handleConfirm = async () => {
        try {
            // Simulate OTP - in real case you'd validate OTP before confirming
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/bookings/confirm`,
                { doctorId, date, time },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setStatus('Booking confirmed!');
        } catch (err) {
            setStatus(err.response?.data?.message || 'Error confirming booking');
        }
    };

    return (
        <div>
            <button onClick={handleLock}>Lock Slot</button>
            <button onClick={handleConfirm}>Confirm Booking (OTP Mock)</button>
            <p>{status}</p>
        </div>
    );
};

export default BookSlot;
