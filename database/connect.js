import sqlite3 from 'sqlite3';
import createSchema from './schema.js';

// Function to connect to the database
const connectDB = async () => {
    try {
        const db = await new Promise((resolve, reject) => {
            const dbInstance = new sqlite3.Database('./database.db', (err) => {
                if (err) {
                    reject(err); // Reject if there's an error
                } else {
                    console.log('Connected to the database.');
                    resolve(dbInstance); // Resolve with the database object if connected successfully
                }
            });
        });
        return await createSchema(db);
    } catch (err_1) {
        console.error('Error connecting to the database:', err_1);
    }
};

export default connectDB;
