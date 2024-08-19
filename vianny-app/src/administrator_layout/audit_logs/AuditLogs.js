/* src/administrator_layout/audit_logs/AuditLogs.js */ 

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AuditLogs.css'; // Import the CSS file for styling

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch audit logs from the backend
    const fetchLogs = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/auditlogs/');
        setLogs(response.data);
        setLoading(false);
      } catch (error) {
        setError('Error fetching audit logs');
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="audit-logs-container">
      <h1>Audit Logs</h1>
      <table className="audit-logs-table">
        <thead>
          <tr>
            <th>Log ID</th>
            <th>Timestamp</th>
            <th>User</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {logs.map(log => (
            <tr key={log.log_id}>
              <td>{log.log_id}</td>
              <td>{new Date(log.timestamp).toLocaleString()}</td>
              <td>{log.user.username}</td>
              <td>{log.action}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AuditLogs;
