import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./database.db');

// Create Quiz
export const createQuiz = (req, res) => {
    try {
        // Extract data from the request body
        const {
            QuizTitle,
            Description,
            Duration,
            TeacherID,
            CourseID,
            StartTime,
        } = req.body;

        // Insert the quiz into the Quizzes table
        const insertQuizSql = `INSERT INTO Quizzes (QuizTitle, Description, Duration, TeacherID, CourseID, StartTime) VALUES (?, ?, ?, ?, ?, ?)`;
        db.run(
            insertQuizSql,
            [QuizTitle, Description, Duration, TeacherID, CourseID, StartTime],
            function (err) {
                if (err) {
                    console.error('Error creating quiz:', err);
                    res.status(500).send('Internal Server Error');
                } else {
                    const quizId = this.lastID;
                    res.status(201).json({ quizId });
                    console.log('Quiz created successfully');
                }
            }
        );
    } catch (error) {
        console.error('Error creating quiz:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Get Quizzes
export const getQuizzes = (req, res) => {
    try {
        // Retrieve all quizzes from the Quizzes table
        const selectQuizzesSql = `SELECT * FROM Quizzes`;
        db.all(selectQuizzesSql, (err, quizzes) => {
            if (err) {
                console.error('Error getting quizzes:', err);
                res.status(500).send('Internal Server Error');
            } else {
                res.json(quizzes);
            }
        });
    } catch (error) {
        console.error('Error getting quizzes:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Get Quiz by ID
export const getQuizById = (req, res) => {
    try {
        const quizId = req.params.id;

        // Retrieve a specific quiz by its ID
        const selectQuizSql = `SELECT * FROM Quizzes WHERE QuizID = ?`;
        db.get(selectQuizSql, [quizId], (err, quiz) => {
            if (err) {
                console.error('Error getting quiz:', err);
                res.status(500).send('Internal Server Error');
            } else if (!quiz) {
                res.status(404).send('Quiz not found');
            } else {
                res.json(quiz);
            }
        });
    } catch (error) {
        console.error('Error getting quiz:', error);
        res.status(500).send('Internal Server Error');
    }
};
export const getQuizByCourseId = (req, res) => {
    try {
        const courseId = req.params.id;

        // Retrieve a specific quiz by its ID
        const selectQuizSql = `SELECT * FROM Quizzes WHERE CourseID = ?`;
        db.all(selectQuizSql, [courseId], (err, quizzes) => {
            if (err) {
                console.error('Error getting quizzes:', err);
                res.status(500).send('Internal Server Error');
            } else {
                res.json(quizzes);
            }
        });
    } catch (error) {
        console.error('Error getting quiz:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Update Quiz
export const updateQuiz = (req, res) => {
    try {
        const quizId = req.params.id;
        const {
            QuizTitle,
            Description,
            Duration,
            TeacherID,
            CourseID,
            StartTime,
        } = req.body;

        // Update the quiz in the Quizzes table
        const updateQuizSql = `UPDATE Quizzes SET QuizTitle = ?, Description = ?, Duration = ?, TeacherID = ?, CourseID = ?, StartTime = ? WHERE QuizID = ?`;
        db.run(
            updateQuizSql,
            [
                QuizTitle,
                Description,
                Duration,
                TeacherID,
                CourseID,
                StartTime,
                quizId,
            ],
            function (err) {
                if (err) {
                    console.error('Error updating quiz:', err);
                    res.status(500).json({ message: 'Internal Server Error' });
                } else if (this.changes === 0) {
                    res.status(404).send('Quiz not found');
                } else {
                    res.json({
                        quizId,
                        QuizTitle,
                        Description,
                        Duration,
                        TeacherID,
                        CourseID,
                        StartTime,
                    });
                }
            }
        );
    } catch (error) {
        console.error('Error updating quiz:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Delete Quiz
export const deleteQuiz = (req, res) => {
    try {
        const quizId = req.params.id;

        // Delete the quiz from the Quizzes table
        const deleteQuizSql = `DELETE FROM Quizzes WHERE QuizID = ?`;
        db.run(deleteQuizSql, [quizId], function (err) {
            if (err) {
                console.error('Error deleting quiz:', err);
                res.status(500).json({ message: 'Internal Server Error' });
            } else if (this.changes === 0) {
                res.status(404).send('Quiz not found');
            } else {
                res.json({ message: 'Quiz deleted successfully' });
            }
        });
    } catch (error) {
        console.error('Error deleting quiz:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
