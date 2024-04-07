import sqlite3 from 'sqlite3';

// Function to connect to the database
const connectDB = () => {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database('./database.db', (err) => {
            if (err) {
                reject(err); // Reject if there's an error
            } else {
                console.log('Connected to the database.');
                resolve(db); // Resolve with the database object if connected successfully
            }
        });
    });
};

export default connectDB;
