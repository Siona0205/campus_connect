const express = require('express');
const mysql = require('mysql');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path'); // For serving static files

const app = express();

app.use(cors());
app.use(express.json()); // Middleware to parse JSON requests

// Serve static files from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // MySQL password
  database: 'campusconnect', // Your database name
  port: 3306,
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    process.exit(1);
  } else {
    console.log('Connected to the MySQL database.');
  }
});

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'pp9449409@gmail.com', // Replace with your email
    pass: 'liku arom lkpi sxsy', // Replace with your app-specific or email password
  },
});

// Helper function to send emails
const sendEmail = (from, to, subject, text) => {
  const mailOptions = {
    from,
    to,
    subject,
    text,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error('Error sending email:', err);
    } else {
      console.log('Email sent successfully:', info.response);
    }
  });
};

// Login route to authenticate user
app.post('/login', (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({ success: false, message: 'Please provide username, password, and role' });
  }

  const query = 'SELECT id, role FROM users WHERE username = ? AND password = ? AND role = ?';
  
  db.query(query, [username, password, role], (err, results) => {
    if (err) {
      console.error('Error querying users:', err);
      return res.status(500).json({ success: false, message: 'Something went wrong' });
    }

    if (results.length > 0) {
      const user = results[0];
      res.json({ success: true, message: 'Login successful', studentId: user.id, role: user.role });
    } else {
      res.status(400).json({ success: false, message: 'Invalid credentials' });
    }
  });
});

// Complaint submission route
app.post('/complaints', (req, res) => {
  const { student_id, title, urgency, category, description } = req.body;

  const query = `
    INSERT INTO complaints (student_id, title, urgency, category, description, status)
    VALUES (?, ?, ?, ?, ?, 'Pending')
  `;

  db.query(query, [student_id, title, urgency, category, description], (err, results) => {
    if (err) {
      console.error('Error inserting complaint:', err);
      return res.status(500).json({ success: false, message: 'Failed to submit complaint' });
    }

    console.log('Complaint inserted with ID:', results.insertId);

    // Fetch the student's and admin's email
    const emailQuery = `
      SELECT 
        student.email AS student_email, 
        admin.email AS admin_email
      FROM users AS student
      CROSS JOIN users AS admin
      WHERE student.id = ? AND admin.role = "admin" LIMIT 1;
    `;
    db.query(emailQuery, [student_id], (err, emailResults) => {
      if (err || emailResults.length === 0) {
        console.error('Error fetching emails:', err);
        return res.status(500).json({ success: false, message: 'Failed to notify admin' });
      }

      const { student_email, admin_email } = emailResults[0];

      sendEmail(
        student_email,
        admin_email,
        'New Complaint Filed',
        `A new complaint has been filed:
        - Student ID: ${student_id}
        - Title: ${title}
        - Urgency: ${urgency}
        - Category: ${category}
        - Description: ${description}.
        
        Please log in to review the complaint.`
      );

      res.status(201).json({ success: true, message: 'Complaint submitted successfully' });
    });
  });
});

// Update complaint status
app.put('/complaints/:id/status', (req, res) => {
  const complaintId = req.params.id;
  const { status } = req.body;

  const query = 'UPDATE complaints SET status = ? WHERE id = ?';

  db.query(query, [status, complaintId], (err, results) => {
    if (err) {
      console.error('Error updating complaint status:', err);
      return res.status(500).json({ success: false, message: 'Failed to update complaint status' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    // Notify student via email
    const emailQuery = `
      SELECT users.email
      FROM complaints
      JOIN users ON complaints.student_id = users.id
      WHERE complaints.id = ?
    `;
    db.query(emailQuery, [complaintId], (err, emailResults) => {
      if (err || emailResults.length === 0) {
        console.error('Error fetching student email:', err);
        return res.status(500).json({ success: false, message: 'Failed to notify student' });
      }

      const studentEmail = emailResults[0].email;

      sendEmail(
        'pp9449409@gmail.com',
        studentEmail,
        'Complaint Status Updated',
        `The status of your complaint (ID: ${complaintId}) has been updated to: ${status}.`
      );

      res.json({ success: true, message: 'Complaint status updated successfully' });
    });
  });
});

// Get all complaints (admin view)
app.get('/complaints', (req, res) => {
  const query = 'SELECT * FROM complaints';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching complaints:', err);
      return res.status(500).json({ success: false, message: 'Failed to fetch complaints' });
    }

    res.json({ success: true, complaints: results });
  });
});

// Get complaints by student ID
app.get('/complaints/:studentId', (req, res) => {
  const studentId = req.params.studentId;

  const query = 'SELECT * FROM complaints WHERE student_id = ?';
  db.query(query, [studentId], (err, results) => {
    if (err) {
      console.error('Error fetching complaints:', err);
      return res.status(500).json({ success: false, message: 'Failed to fetch complaints' });
    }

    res.json({ success: true, complaints: results });
  });
});

// Get complaint stats grouped by category
app.get('/complaints/category-stats', (req, res) => {
  const query = `
    SELECT category, COUNT(*) as count
    FROM complaints
    GROUP BY category
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching complaint stats:', err);
      return res.status(500).json({ success: false, message: 'Failed to fetch category stats' });
    }

    res.json({ success: true, stats: results });
  });
});

// Get detailed complaint information by ID
app.get('/complaints/:id/details', (req, res) => {
  const complaintId = req.params.id;

  const query = `
    SELECT 
        c.id, c.title, c.description, c.urgency, c.category, c.status,
        u.id AS student_id, u.username, u.email
    FROM complaints c
    JOIN users u ON c.student_id = u.id
    WHERE c.id = ?;
  `;

  db.query(query, [complaintId], (err, results) => {
    if (err) {
      console.error('Error fetching complaint details:', err);
      return res.status(500).json({ success: false, message: 'Error fetching complaint details' });
    }

    if (results.length === 0) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    res.json({ success: true, complaint: results[0] });
  });
});

// Start the server
app.listen(5000, () => {
  console.log('Server is running on http://localhost:5000');
});
