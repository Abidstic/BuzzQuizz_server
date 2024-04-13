import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./database.db');

// Create Question
export const createQuestion = (req, res) => {
    try {
        // Extract data from the request body
        const { QuestionText, QuestionType, QuizID } = req.body;

        // Insert the question into the Questions table
        const insertQuestionSql = `INSERT INTO Questions (QuestionText, QuestionType, QuizID) VALUES (?, ?, ?)`;
        db.run(
            insertQuestionSql,
            [QuestionText, QuestionType, QuizID],
            function (err) {
                if (err) {
                    console.error('Error creating question:', err);
                    res.status(500).send('Internal Server Error');
                } else {
                    const questionId = this.lastID;
                    res.status(201).json({ questionId });
                    console.log('Question created successfully');
                }
            }
        );
    } catch (error) {
        console.error('Error creating question:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Get Questions by Quiz ID
export const getQuestionsByQuizId = (req, res) => {
    try {
        const quizId = req.params.id;

        // Retrieve all questions associated with a specific quiz
        const selectQuestionsSql = `SELECT * FROM Questions WHERE QuizID = ?`;
        db.all(selectQuestionsSql, [quizId], (err, questions) => {
            if (err) {
                console.error('Error getting questions:', err);
                res.status(500).send('Internal Server Error');
            } else {
                res.json(questions);
            }
        });
    } catch (error) {
        console.error('Error getting questions:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Update Question
export const updateQuestion = (req, res) => {
    try {
        const questionId = req.params.id;
        const { QuestionText, QuestionType, QuizID } = req.body;

        // Update the question in the Questions table
        const updateQuestionSql = `UPDATE Questions SET QuestionText = ?, QuestionType = ?, QuizID = ? WHERE QuestionID = ?`;
        db.run(
            updateQuestionSql,
            [QuestionText, QuestionType, QuizID, questionId],
            function (err) {
                if (err) {
                    console.error('Error updating question:', err);
                    res.status(500).json({ message: 'Internal Server Error' });
                } else if (this.changes === 0) {
                    res.status(404).send('Question not found');
                } else {
                    res.json({
                        questionId,
                        QuestionText,
                        QuestionType,
                        QuizID,
                    });
                }
            }
        );
    } catch (error) {
        console.error('Error updating question:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Delete Question
export const deleteQuestion = (req, res) => {
    try {
        const questionId = req.params.id;

        // Delete the question from the Questions table
        const deleteQuestionSql = `DELETE FROM Questions WHERE QuestionID = ?`;
        db.run(deleteQuestionSql, [questionId], function (err) {
            if (err) {
                console.error('Error deleting question:', err);
                res.status(500).json({ message: 'Internal Server Error' });
            } else if (this.changes === 0) {
                res.status(404).send('Question not found');
            } else {
                res.json({ message: 'Question deleted successfully' });
            }
        });
    } catch (error) {
        console.error('Error deleting question:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
