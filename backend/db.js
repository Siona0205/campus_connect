const mysql = require('mysql2');

// Create the connection pool
const pool = mysql.createPool({
    host: 'localhost',          // Your MySQL host
    user: 'root',               // Your MySQL username
    password: '',               // Your MySQL password (leave empty if none)
    database: 'complaint_system', // Your database name
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Export a promise-based pool for async/await
const promisePool = pool.promise();

module.exports = promisePool;
