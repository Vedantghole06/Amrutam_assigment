import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
    const [form, setForm] = useState({ name: '', email: '', password: '', role: 'patient' });
    const [error, setError] = useState('');
    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/register`, form);
            localStorage.setItem('token', res.data.token);
            // Redirect or reload after login
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input name="name" onChange={handleChange} placeholder="Name" required />
            <input name="email" onChange={handleChange} type="email" placeholder="Email" required />
            <input name="password" onChange={handleChange} type="password" placeholder="Password" required />
            <select name="role" onChange={handleChange}>
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
            </select>
            <button type="submit">Register</button>
            {error && <div>{error}</div>}
        </form>
    );
};
export default Register;
