// generateHash.js
const bcrypt = require('bcryptjs');

// Your plain password
const plainPassword = 'yourPassword123';  // Replace with your actual password

// Generate hashed password
const hashedPassword = bcrypt.hashSync(plainPassword, 10);  // 10 is the salt rounds (strength)

console.log('Hashed password:', hashedPassword);
