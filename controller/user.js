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
        const userId = await new Promise((resolve, reject) => {
            db.run(
                insertUserSql,
                [
                    userName,
                    hashedPassword,
                    firstName,
                    lastName,
                    email,
                    userRole,
                ],
                function (err) {
                    if (err) reject(err);
                    else resolve(this.lastID);
                }
            );
        });

        const token = generateToken(userId, userRole);
        res.status(201).json({ userId, token });
        console.log('user created successfully');
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).send('Internal Server Error');
    }
}

// Login (Get User)
export async function loginUser(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { userName, password } = req.body;

    try {
        const user = await new Promise((resolve, reject) => {
            db.get(
                `SELECT * FROM Users WHERE Username = ?`,
                [userName],
                (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                }
            );
        });

        if (!user) {
            return res.status(404).send('User not found');
        }

        const match = await bcrypt.compare(password, user.Password);
        if (!match) {
            return res.status(401).send('Invalid credentials');
        }

        const userId = user.UserID;
        const userRole = user.UserRole;
        const token = generateToken(userId, userRole);
        res.json({ userId, token, userRole });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).send('Internal Server Error');
    }
}

//
export async function logout(req, res) {
    // Clear the user session or any data associated with the user
    res.json({ message: 'Logout successful' });
    await new Promise((resolve) => db.close(resolve));
}

// Get User by ID
export async function getUserById(req, res) {
    const userId = req.params.id;

    try {
        const user = await new Promise((resolve, reject) => {
            db.get(
                `SELECT * FROM Users WHERE UserID = ?`,
                [userId],
                (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                }
            );
        });

        if (!user) {
            return res.status(404).send('User not found 101');
        }

        res.json(user);
    } catch (error) {
        console.error('Error getting user:', error);
        res.status(500).send('Internal Server Error');
    }
}

export async function getUserId(userId) {
    const sql = `SELECT * FROM Users WHERE UserID = ?`;
    return new Promise((resolve, reject) => {
        db.get(sql, [userId], (err, user) => {
            if (err) {
                console.error('Error getting user:', err);
                reject(err);
            } else if (!user) {
                reject('User not found');
            } else {
                resolve(user);
            }
        });
    });
}

// Update User
export async function updateUser(req, res) {
    console.log('heree........');
    try {
        const userId = req.params.id;
        const { firstName, lastName, email, userRole } = req.body;
        console.log({ firstName, lastName, email, userRole, userId });

        let updateValues = [];
        let updateFields = [];

        if (firstName !== undefined) {
            updateFields.push('FirstName = ?');
            updateValues.push(firstName);
        }
        if (lastName !== undefined) {
            updateFields.push('LastName = ?');
            updateValues.push(lastName);
        }
        if (email !== undefined) {
            updateFields.push('Email = ?');
            updateValues.push(email);
        }
        if (userRole !== undefined) {
            updateFields.push('UserRole = ?');
            updateValues.push(userRole);
        }

        if (updateFields.length > 0) {
            const updateUserSql = `UPDATE Users SET ${updateFields.join(
                ', '
            )} WHERE UserID = ?`;
            const values = [...updateValues, userId];
            await new Promise((resolve, reject) => {
                db.run(updateUserSql, values, (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });
        }

        const user = await getUserId(userId);
        res.json(user);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

// Delete User
export async function deleteUser(req, res) {
    try {
        const userId = req.params.id;

        // Delete the user
        const deleteUserSql = `DELETE FROM Users WHERE UserID = ?`;
        await new Promise((resolve, reject) => {
            db.run(deleteUserSql, [userId], (err) => {
                if (err) reject(err);
                else resolve();
            });
        });

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
