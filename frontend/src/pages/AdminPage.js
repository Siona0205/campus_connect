import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';

const AdminPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [message, setMessage] = useState('');
  const [categoryStats, setCategoryStats] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:5000/complaints')
      .then((response) => {
        if (response.data.success) {
          setComplaints(response.data.complaints || []);
        } else {
          setMessage('Failed to fetch complaints');
        }
      })
      .catch((error) => {
        console.error('Error fetching complaints:', error);
        setMessage('Error fetching complaints');
      });

    axios
      .get('http://localhost:5000/complaints/category-stats')
      .then((response) => {
        if (response.data.success) {
          setCategoryStats(response.data.stats || []);
        } else {
          setMessage('Failed to fetch category stats');
        }
      })
      .catch((error) => {
        console.error('Error fetching category stats:', error);
        setMessage('Error fetching category stats');
      });
  }, []);

  const handleStatusChange = (complaintId, newStatus) => {
    axios
      .put(`http://localhost:5000/complaints/${complaintId}/status`, {
        status: newStatus,
      })
      .then((response) => {
        if (response.data.success) {
          setMessage('Complaint status updated successfully');
          setComplaints((prevComplaints) =>
            prevComplaints.map((complaint) =>
              complaint.id === complaintId ? { ...complaint, status: newStatus } : complaint
            )
          );
        } else {
          setMessage('Failed to update status');
        }
      })
      .catch((error) => {
        console.error('Error updating status:', error);
        setMessage('Failed to update status');
      });
  };

  const chartData = {
    labels: categoryStats.map((stat) => stat.category),
    datasets: [
      {
        label: 'Complaints by Category',
        data: categoryStats.map((stat) => stat.count),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
      },
    ],
  };

  return (
    <div className="admin-container">
      <h2 className="admin-heading">Admin Dashboard</h2>
      {message && <p className="error-message">{message}</p>}

      <div className="chart-container">
        <h3>Complaints by Category</h3>
        {categoryStats.length > 0 ? <Pie data={chartData} /> : <p>No data available for category breakdown.</p>}
      </div>

      <div className="complaints-container">
        <h3>All Complaints</h3>
        <table className="complaints-table">
          <thead>
            <tr>
              <th>Complaint ID</th>
              <th>Student ID</th>
              <th>Title</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {complaints.length > 0 ? (
              complaints.map((complaint) => (
                <tr key={complaint.id}>
                  <td>{complaint.id}</td>
                  <td>{complaint.student_id}</td>
                  <td>
                    <Link to={`/complaints/${complaint.id}/details`}>{complaint.title}</Link>
                  </td>
                  <td>{complaint.status}</td>
                  <td>
                    <select
                      value={complaint.status}
                      onChange={(e) => handleStatusChange(complaint.id, e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Noted">Noted</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No complaints available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPage;
