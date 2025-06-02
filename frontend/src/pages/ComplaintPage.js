import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';


const ComplaintPage = ({ studentId }) => {
  const [title, setTitle] = useState('');
  const [urgency, setUrgency] = useState('Medium');
  const [category, setCategory] = useState('Faculty');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [complaints, setComplaints] = useState([]);

  const fetchComplaints = useCallback(() => {
    axios.get(`http://localhost:5000/complaints/${studentId}`)
      .then((response) => {
        if (response.data.success) {
          setComplaints(response.data.complaints);
        } else {
          setMessage('Failed to fetch complaints');
        }
      })
      .catch((error) => {
        console.error('Error fetching complaints:', error);
        setMessage('Error fetching complaints');
      });
  }, [studentId]);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/complaints', {
        student_id: studentId,
        title,
        urgency,
        category,
        description,
      });

      if (response.data.success) {
        setMessage('Complaint submitted successfully!');
        setTitle('');
        setUrgency('Medium');
        setCategory('Faculty');
        setDescription('');
        fetchComplaints();
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      console.error('Error submitting complaint:', error);
      setMessage('Failed to submit complaint. Please try again.');
    }
  };

  const getStatusClass = (status) => {
    if (status === 'Pending') return 'status-pending';
    if (status === 'Noted') return 'status-noted';
    if (status === 'Resolved') return 'status-resolved';
    return '';
  };

  return (
    <div className="complaint-page">
      <h2>Submit a Complaint</h2>
      {message && <p className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Urgency</label>
          <select value={urgency} onChange={(e) => setUrgency(e.target.value)} required>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
        </div>
        <div>
          <label>Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} required>
            <option value="Faculty">Faculty</option>
            <option value="Peer Group">Peer Group</option>
            <option value="Infrastructure">Infrastructure</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label>Description</label>
          <textarea
            rows="3"
            cols="25"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>
        <button type="submit">Submit</button>
      </form>

      <h2>Previously Filed Complaints</h2>
      {complaints.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Complaint ID</th>
              <th>Title</th>
              <th>Urgency</th>
              <th>Category</th>
              <th>Description</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((complaint) => (
              <tr key={complaint.id}>
                <td>{complaint.id}</td>
                <td>{complaint.title}</td>
                <td>{complaint.urgency}</td>
                <td>{complaint.category}</td>
                <td>{complaint.description}</td>
                <td className={getStatusClass(complaint.status)}>{complaint.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No complaints filed yet.</p>
      )}
    </div>
  );
};

export default ComplaintPage;
