import sqlite3 from 'sqlite3';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';

/**db path */
const db = new sqlite3.Database('./database.db');
// Helper function to generate JWT token
const generateToken = (userId, userRole) => {
    return jwt.sign({ userId, userRole }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });
};

// Create (Register) User
export async function registerUser(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { userName, password, firstName, lastName, email, userRole } =
        req.body;

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into Users table
        const insertUserSql = `INSERT INTO Users (Username, Password, FirstName, LastName, Email, UserRole) VALUES (?, ?, ?, ?, ?, ?)`;
        db.run(
            insertUserSql,
            [userName, hashedPassword, firstName, lastName, email, userRole],
            function (err) {
                if (err) {
                    console.error('Error creating user:', err);
                    res.status(500).send('Internal Server Error');
                } else {
                    const userId = this.lastID;
                    const token = generateToken(userId, userRole);
                    res.status(201).json({ userId, token });
                    console.log('user created successfully');
                }
            }
        );
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).send('Internal Server Error');
    }
}

// Login (Get User)
const loginUser = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { userName, password } = req.body;

    const sql = `SELECT * FROM Users WHERE Username = ?`;
    db.get(sql, [userName], async (err, user) => {
        if (err) {
            console.error('Error getting user:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        if (!user) {
            res.status(404).send('User not found');
            return;
        }

        try {
            // Compare the provided password with the hashed password
            const match = await bcrypt.compare(password, user.Password);
            if (!match) {
                res.status(401).send('Invalid credentials');
                return;
            }

            // Generate JWT token
            const userId = user.UserID;
            const userRole = user.UserRole;
            const token = generateToken(userId, userRole);
            res.json({ userId, token });
        } catch (error) {
            console.error('Error comparing passwords:', error);
            res.status(500).send('Internal Server Error');
        }
    });
};
const logout = (req, res) => {
    // Clear the user session or any data associated with the user
    res.json({ message: 'Logout successful' });
    db.close();
};

// Get User by ID
const getUserById = (req, res) => {
    const userId = req.params.id;

    const sql = `SELECT * FROM Users WHERE UserID = ?`;
    db.get(sql, [userId], (err, user) => {
        if (err) {
            console.error('Error getting user:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        if (!user) {
            res.status(404).send('User not found 101');
            return;
        }

        res.json(user);
    });
};

// Update User
const updateUser = (req, res) => {
    try {
        const userId = req.params.id;
        const { firstName, lastName, email, userRole } = req.body;

        // Update the user's information
        const updateUserSql = `UPDATE Users SET FirstName = ?, LastName = ?, Email = ?, UserRole = ? WHERE UserID = ?`;
        db.run(updateUserSql, [firstName, lastName, email, userRole, userId]);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
// Delete User
const deleteUser = (req, res) => {
    try {
        const userId = req.params.id;

        // Delete the user
        const deleteUserSql = `DELETE FROM Users WHERE UserID = ?`;
        db.run(deleteUserSql, [userId]);

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export { loginUser, getUserById, updateUser, deleteUser, logout };