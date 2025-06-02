-- Use the complaint_system database
USE campusconnect;

-- Create the users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL UNIQUE,
    role ENUM('student', 'admin') NOT NULL,
    email VARCHAR(255) NOT NULL
);

-- Create the complaints table
CREATE TABLE complaints (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    urgency ENUM('Medium', 'High', 'Critical') NOT NULL,
    category ENUM('Faculty', 'Peer Group', 'Infrastructure', 'Other') NOT NULL,
    description TEXT NOT NULL,
    status ENUM('Pending', 'Resolved', 'Noted') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id)
);
