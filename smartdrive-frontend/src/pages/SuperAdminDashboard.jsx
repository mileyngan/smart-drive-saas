// src/pages/SuperAdminDashboard.jsx
import React, { useState, useEffect } from 'react';

const SuperAdminDashboard = () => {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  // In real app, get token from localStorage
  // For demo, we'll hardcode a token or simulate
  const token = localStorage.getItem('token'); // ← GET TOKEN FROM LOCAL STORAGE

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/superadmin/schools', {
        headers: {
          'Authorization': 'Bearer ' + token // ← You need a real token from login
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch schools');
      }

      const data = await response.json();
      setSchools(data);
      setLoading(false);
    } catch (err) {
      console.error('Error:', err);
      setMessage('❌ Failed to load schools. Make sure you’re logged in as super_admin.');
      setLoading(false);
    }
  };

  const handleApprove = async (schoolId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/superadmin/approve/${schoolId}`, {
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setMessage(`✅ School approved!`);
        fetchSchools(); // Refresh list
      } else {
        const errorData = await response.json();
        setMessage(`❌ ${errorData.message}`);
      }
    } catch (err) {
      setMessage('❌ Network error');
    }
  };

  const handleReject = async (schoolId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/superadmin/reject/${schoolId}`, {
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setMessage(`❌ School rejected.`);
        fetchSchools(); // Refresh list
      } else {
        const errorData = await response.json();
        setMessage(`❌ ${errorData.message}`);
      }
    } catch (err) {
      setMessage('❌ Network error');
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '20px' }}>
      <h1>Super Admin Dashboard</h1>
      <p>Approve or reject pending driving schools.</p>

      {message && (
        <div style={{
          margin: '20px 0',
          padding: '10px',
          backgroundColor: message.includes('✅') ? '#d4edda' : '#f8d7da',
          color: message.includes('✅') ? '#155724' : '#721c24',
          border: '1px solid',
          borderColor: message.includes('✅') ? '#c3e6cb' : '#f5c6cb',
          borderRadius: '4px'
        }}>
          {message}
        </div>
      )}

      {loading ? (
        <p>Loading pending schools...</p>
      ) : schools.length === 0 ? (
        <p>🎉 No pending schools. All caught up!</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>School Name</th>
              <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>Email</th>
              <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>Deployment</th>
              <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>Subscription</th>
              <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {schools.map(school => (
              <tr key={school.id}>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{school.name}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{school.email}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{school.deployment}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{school.subscription}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  <button
                    onClick={() => handleApprove(school.id)}
                    style={{
                      marginRight: '10px',
                      padding: '5px 10px',
                      backgroundColor: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(school.id)}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SuperAdminDashboard;