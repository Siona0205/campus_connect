import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ComplaintDetailsPage = () => {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    axios
      .get(`http://localhost:5000/complaints/${id}/details`)
      .then((response) => {
        if (response.data.success) {
          setComplaint(response.data.complaint);
        } else {
          setError('Failed to fetch complaint details');
        }
      })
      .catch((err) => {
        console.error('Error fetching complaint details:', err);
        setError('Error fetching complaint details');
      });
  }, [id]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!complaint) {
    return <div>Loading...</div>;
  }

  return (
    <div className="complaint-details">
      <h2>Complaint Details</h2>
      <p><strong>Title:</strong> {complaint.title}</p>
      <p><strong>Description:</strong> {complaint.description}</p>
      <p><strong>Urgency:</strong> {complaint.urgency}</p>
      <p><strong>Category:</strong> {complaint.category}</p>
      <p><strong>Status:</strong> {complaint.status}</p>
      
      <h3>Student Details</h3>
      <div>
        <img 
          src={`/images/uploads/${complaint.photo}`} 
          alt="Student Profile" 
          style={{ width: '150px', borderRadius: '50%' }} 
        />
      </div>
      <p><strong>Student Name:</strong> {complaint.username}</p>
      <p><strong>Email:</strong> {complaint.email}</p>
    </div>
  );
};

export default ComplaintDetailsPage;
