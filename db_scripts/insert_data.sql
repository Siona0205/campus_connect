-- Insert predefined users into the users table
INSERT INTO users (username, password, role)
VALUES
('Aaron P', 'AaP@123', 'student','sionagonsalves202@gmail.com'), -- Replace hashedpassword1 with bcrypt hash
('Bryan Fds', 'BrF@123', 'student','shalinilu60@gmail.com'), -- Replace hashedpassword1 with bcrypt hash
('Cianna Lopes', 'CiL@123', 'student','karthiklv234234@gmail.com'),
('Chirag Sharma', 'Chs@123', 'student','lushalini4@gmail.com'), -- Replace hashedpassword1 with bcrypt hash
('Nafiya Sab', 'NaS@123', 'student','shalinilu491@gmail.com'),
('Rony G', 'ghs_la@20', 'admin','shreyaspshreya55@gmail.com');  -- Replace hashedadminpassword with bcrypt hash

-- Note: Passwords should be hashed using bcrypt. Example: bcrypt.hash('yourpassword', saltRounds);
