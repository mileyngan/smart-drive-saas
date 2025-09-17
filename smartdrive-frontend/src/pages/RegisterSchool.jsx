// src/pages/RegisterSchool.jsx
import React, { useState } from 'react';

const RegisterSchool = () => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    deployment: 'cloud',
    subscription: 'basic'
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/school/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) {
        setMessage(`✅ ${result.message}`);
      } else {
        setMessage(`❌ ${result.message}`);
      }
    } catch (err) {
      setMessage('❌ Network error. Is backend running?');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h2>Register Your Driving School</h2>
      {message && <div style={{ margin: '20px 0', padding: '10px', backgroundColor: message.includes('✅') ? '#d4edda' : '#f8d7da', color: message.includes('✅') ? '#155724' : '#721c24', border: '1px solid', borderColor: message.includes('✅') ? '#c3e6cb' : '#f5c6cb', borderRadius: '4px' }}>
        {message}
      </div>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>School Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Deployment</label>
          <select
            name="deployment"
            value={formData.deployment}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
          >
            <option value="cloud">Cloud (Managed by Us)</option>
            <option value="selfhosted">Self-Hosted (You Manage Server)</option>
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Subscription Plan</label>
          <select
            name="subscription"
            value={formData.subscription}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
          >
            <option value="basic">Basic (Up to 50 students)</option>
            <option value="pro">Pro (Up to 200 students)</option>
            <option value="enterprise">Enterprise (Up to 1000 students)</option>
          </select>
        </div>

        <button
          type="submit"
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Register School
        </button>
      </form>
    </div>
  );
};

export default RegisterSchool;