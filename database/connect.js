import sqlite3 from 'sqlite3';
import createSchema from './schema.js';

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
    })
        .then((db) => {
            // After connecting to the database, call createSchema function
            return createSchema(db);
        })
        .catch((err) => {
            console.error('Error connecting to the database:', err);
        });
};

export default connectDB;
