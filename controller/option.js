import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./database.db');

// Create Option
export const createOption = (req, res) => {
    try {
        // Extract data from the request body
        const { OptionText, IsCorrect, QuestionID } = req.body;

        // Insert the option into the Options table
        const insertOptionSql = `INSERT INTO Options (OptionText, IsCorrect, QuestionID) VALUES (?, ?, ?)`;
        db.run(
            insertOptionSql,
            [OptionText, IsCorrect, QuestionID],
            function (err) {
                if (err) {
                    console.error('Error creating option:', err);
                    res.status(500).send('Internal Server Error');
                } else {
                    const optionId = this.lastID;
                    res.status(201).json({ optionId });
                    console.log('Option created successfully');
                }
            }
        );
    } catch (error) {
        console.error('Error creating option:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Get Options by Question ID
export const getOptionsByQuestionId = (req, res) => {
    try {
        const questionId = req.params.id;

        // Retrieve all options associated with a specific question
        const selectOptionsSql = `SELECT * FROM Options WHERE QuestionID = ?`;
        db.all(selectOptionsSql, [questionId], (err, options) => {
            if (err) {
                console.error('Error getting options:', err);
                res.status(500).send('Internal Server Error');
            } else {
                res.json(options);
            }
        });
    } catch (error) {
        console.error('Error getting options:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Update Option
export const updateOption = (req, res) => {
    try {
        const optionId = req.params.id;
        const { OptionText, IsCorrect, QuestionID } = req.body;

        // Update the option in the Options table
        const updateOptionSql = `UPDATE Options SET OptionText = ?, IsCorrect = ?, QuestionID = ? WHERE OptionID = ?`;
        db.run(
            updateOptionSql,
            [OptionText, IsCorrect, QuestionID, optionId],
            function (err) {
                if (err) {
                    console.error('Error updating option:', err);
                    res.status(500).json({ message: 'Internal Server Error' });
                } else if (this.changes === 0) {
                    res.status(404).send('Option not found');
                } else {
                    res.json({ optionId, OptionText, IsCorrect, QuestionID });
                }
            }
        );
    } catch (error) {
        console.error('Error updating option:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Delete Option
export const deleteOption = (req, res) => {
    try {
        const optionId = req.params.id;

        // Delete the option from the Options table
        const deleteOptionSql = `DELETE FROM Options WHERE OptionID = ?`;
        db.run(deleteOptionSql, [optionId], function (err) {
            if (err) {
                console.error('Error deleting option:', err);
                res.status(500).json({ message: 'Internal Server Error' });
            } else if (this.changes === 0) {
                res.status(404).send('Option not found');
            } else {
                res.json({ message: 'Option deleted successfully' });
            }
        });
    } catch (error) {
        console.error('Error deleting option:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
