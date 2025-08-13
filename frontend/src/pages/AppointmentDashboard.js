import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AppointmentDashboard = () => {
    const [appointments, setAppointments] = useState([]);
    const [statusFilter, setStatusFilter] = useState('');
    const token = localStorage.getItem('token');

    const fetchAppointments = async () => {
        try {
            const params = {};
            if (statusFilter) params.status = statusFilter;

            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/appointments/me`, {
                headers: { Authorization: `Bearer ${token}` },
                params
            });
            setAppointments(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, [statusFilter]);

    const now = new Date();
    const upcoming = appointments.filter(a => new Date(a.date) >= now);
    const past = appointments.filter(a => new Date(a.date) < now);

    return (
        <div>
            <h2>My Appointments</h2>
            <label>Filter by status: </label>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                <option value="">All</option>
                <option value="Booked">Booked</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
            </select>

            <h3>Upcoming</h3>
            <ul>
                {upcoming.map(appt => (
                    <li key={appt._id}>
                        {appt.date.slice(0, 10)} {appt.time} - Dr. {appt.doctor?.user?.name} ({appt.status})
                    </li>
                ))}
            </ul>

            <h3>Past</h3>
            <ul>
                {past.map(appt => (
                    <li key={appt._id}>
                        {appt.date.slice(0, 10)} {appt.time} - Dr. {appt.doctor?.user?.name} ({appt.status})
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AppointmentDashboard;
