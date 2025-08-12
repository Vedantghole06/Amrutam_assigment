import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MyAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const token = localStorage.getItem('token');

    const fetchAppointments = async () => {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/appointments/me`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setAppointments(res.data);
    };

    const cancelAppointment = async (id) => {
        await axios.put(`${import.meta.env.VITE_API_BASE_URL}/bookings/cancel`,
            { appointmentId: id },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        fetchAppointments();
    };

    const rescheduleAppointment = async (id) => {
        const newDate = prompt('Enter new date (YYYY-MM-DD)');
        const newTime = prompt('Enter new time (HH:mm)');
        await axios.put(`${import.meta.env.VITE_API_BASE_URL}/bookings/reschedule`,
            { appointmentId: id, newDate, newTime },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        fetchAppointments();
    };

    useEffect(() => { fetchAppointments(); }, []);

    return (
        <div>
            <h2>My Appointments</h2>
            <ul>
                {appointments.map(appt => (
                    <li key={appt._id}>
                        {appt.date} {appt.time} - {appt.status}
                        {appt.status === 'Booked' && (
                            <>
                                <button onClick={() => rescheduleAppointment(appt._id)}>Reschedule</button>
                                <button onClick={() => cancelAppointment(appt._id)}>Cancel</button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MyAppointments;
