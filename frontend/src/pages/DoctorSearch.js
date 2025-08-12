import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DoctorSearch = () => {
    const [specialization, setSpecialization] = useState('');
    const [mode, setMode] = useState('');
    const [date, setDate] = useState('');
    const [doctors, setDoctors] = useState([]);

    const fetchDoctors = async () => {
        const params = {};
        if (specialization) params.specialization = specialization;
        if (mode) params.mode = mode;
        if (date) params.date = date;

        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/doctors`, { params });
        setDoctors(res.data);
    };

    useEffect(() => { fetchDoctors(); }, []);

    return (
        <div>
            <h2>Find Doctors</h2>
            <input
                placeholder="Specialization"
                value={specialization}
                onChange={e => setSpecialization(e.target.value)}
            />
            <select value={mode} onChange={e => setMode(e.target.value)}>
                <option value="">Any Mode</option>
                <option value="online">Online</option>
                <option value="in-person">In Person</option>
            </select>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} />
            <button onClick={fetchDoctors}>Search</button>

            <ul>
                {doctors.map(doc => (
                    <li key={doc._id}>
                        <strong>{doc.user?.name}</strong> - {doc.specialization} ({doc.mode})
                        | Next Available: {doc.availability[0]?.date?.slice(0, 10)}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DoctorSearch;
