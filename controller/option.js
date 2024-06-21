import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./database.db');

// Create Option
export const createOption = async (req, res) => {
    try {
        // Extract data from the request body
        const { OptionText, IsCorrect, QuestionID } = req.body;

        // Insert the option into the Options table
        const insertOptionSql = `INSERT INTO Options (OptionText, IsCorrect, QuestionID) VALUES (?, ?, ?)`;

        const optionId = await new Promise((resolve, reject) => {
            db.run(
                insertOptionSql,
                [OptionText, IsCorrect, QuestionID],
                function (err) {
                    if (err) reject(err);
                    else resolve(this.lastID);
                }
            );
        });

        res.status(201).json({ optionId });
        console.log('Option created successfully');
    } catch (error) {
        console.error('Error creating option:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Get Correct Options by Quiz ID
export const getCorrectOptionsByQuizId = async (req, res) => {
    try {
        const quizId = req.params.id;

        // Retrieve all correct options associated with the given quiz
        const selectCorrectOptionsSql = `
            SELECT q.QuestionID, q.QuestionText, o.OptionID
            FROM Questions q
            JOIN Options o ON q.QuestionID = o.QuestionID
            WHERE q.QuizID = ? AND o.IsCorrect = 1
            ORDER BY q.QuestionID, o.OptionID
        `;

        const data = await new Promise((resolve, reject) => {
            db.all(selectCorrectOptionsSql, [quizId], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });

        const correctOptionsByQuestion = [];
        let currentQuestion = null;

        data.forEach((row) => {
            if (
                !currentQuestion ||
                row.QuestionID !== currentQuestion.QuestionID
            ) {
                currentQuestion = {
                    QuestionID: row.QuestionID,
                    QuestionText: row.QuestionText,
                    CorrectOptions: [],
                };
                correctOptionsByQuestion.push(currentQuestion);
            }

            currentQuestion.CorrectOptions.push(row.OptionID);
        });

        res.json(correctOptionsByQuestion);
    } catch (error) {
        console.error('Error getting correct options:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Get Options by Question ID
export const getOptionsByQuestionId = async (req, res) => {
    try {
        const questionId = req.params.id;

        // Retrieve all options associated with a specific question
        const selectOptionsSql = `SELECT * FROM Options WHERE QuestionID = ?`;

        const options = await new Promise((resolve, reject) => {
            db.all(selectOptionsSql, [questionId], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });

        res.json(options);
    } catch (error) {
        console.error('Error getting options:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Get Correct Options by Question ID
export const getCorrectOptionsByQuestionId = async (req, res) => {
    try {
        const questionId = req.params.id;

        // Retrieve the correct options associated with the given question
        const selectCorrectOptionsSql = `
            SELECT OptionText
            FROM Options
            WHERE QuestionID = ?
            AND IsCorrect = 1
        `;

        const correctOptions = await new Promise((resolve, reject) => {
            db.all(selectCorrectOptionsSql, [questionId], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });

        if (correctOptions.length === 0) {
            res.status(404).json({
                message: 'No correct options found for the given question',
            });
        } else {
            const correctOptionTexts = correctOptions.map(
                (option) => option.OptionText
            );
            res.json(correctOptionTexts);
        }
    } catch (error) {
        console.error('Error getting correct options:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Update Option
export const updateOption = async (req, res) => {
    try {
        const optionId = req.params.id;
        const { OptionText, IsCorrect, QuestionID } = req.body;

        // Update the option in the Options table
        const updateOptionSql = `UPDATE Options SET OptionText = ?, IsCorrect = ?, QuestionID = ? WHERE OptionID = ?`;

        const result = await new Promise((resolve, reject) => {
            db.run(
                updateOptionSql,
                [OptionText, IsCorrect, QuestionID, optionId],
                function (err) {
                    if (err) reject(err);
                    else resolve(this.changes);
                }
            );
        });

        if (result === 0) {
            res.status(404).send('Option not found');
        } else {
            res.json({ optionId, OptionText, IsCorrect, QuestionID });
        }
    } catch (error) {
        console.error('Error updating option:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Delete Option
export const deleteOption = async (req, res) => {
    try {
        const optionId = req.params.id;

        // Delete the option from the Options table
        const deleteOptionSql = `DELETE FROM Options WHERE OptionID = ?`;

        const result = await new Promise((resolve, reject) => {
            db.run(deleteOptionSql, [optionId], function (err) {
                if (err) reject(err);
                else resolve(this.changes);
            });
        });

        if (result === 0) {
            res.status(404).send('Option not found');
        } else {
            res.json({ message: 'Option deleted successfully' });
        }
    } catch (error) {
        console.error('Error deleting option:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
