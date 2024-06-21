import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./database.db');

// Create Quiz
export const createQuiz = async (req, res) => {
    try {
        const {
            QuizTitle,
            Description,
            Duration,
            TeacherID,
            CourseID,
            StartTime,
        } = req.body;

        const insertQuizSql = `INSERT INTO Quizzes (QuizTitle, Description, Duration, TeacherID, CourseID, StartTime) VALUES (?, ?, ?, ?, ?, ?)`;

        const quizId = await new Promise((resolve, reject) => {
            db.run(
                insertQuizSql,
                [
                    QuizTitle,
                    Description,
                    Duration,
                    TeacherID,
                    CourseID,
                    StartTime,
                ],
                function (err) {
                    if (err) reject(err);
                    else resolve(this.lastID);
                }
            );
        });

        res.status(201).json({ quizId });
        console.log('Quiz created successfully');
    } catch (error) {
        console.error('Error creating quiz:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Get Quizzes
export const getQuizzes = async (req, res) => {
    try {
        const selectQuizzesSql = `SELECT * FROM Quizzes`;

        const quizzes = await new Promise((resolve, reject) => {
            db.all(selectQuizzesSql, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });

        res.json(quizzes);
    } catch (error) {
        console.error('Error getting quizzes:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Get Quiz by ID

export const getQuizById = async (req, res) => {
    try {
        const quizId = req.params.id;

        const selectQuizSql = `SELECT * FROM Quizzes WHERE QuizID = ?`;

        const quiz = await new Promise((resolve, reject) => {
            db.get(selectQuizSql, [quizId], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });

        if (!quiz) {
            return res.status(404).send('Quiz not found');
        }
        res.json(quiz);
    } catch (error) {
        console.error('Error getting quiz:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Get specific courses
export const getQuizByCourseId = async (req, res) => {
    try {
        const courseId = req.params.id;

        const selectQuizSql = `SELECT * FROM Quizzes WHERE CourseID = ?`;

        const quizzes = await new Promise((resolve, reject) => {
            db.all(selectQuizSql, [courseId], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });

        res.json(quizzes);
    } catch (error) {
        console.error('Error getting quiz:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Update Quiz

export const updateQuiz = async (req, res) => {
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

        const updateQuizSql = `UPDATE Quizzes SET QuizTitle = ?, Description = ?, Duration = ?, TeacherID = ?, CourseID = ?, StartTime = ? WHERE QuizID = ?`;

        const result = await new Promise((resolve, reject) => {
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
                    if (err) reject(err);
                    else resolve(this.changes);
                }
            );
        });

        if (result === 0) {
            return res.status(404).send('Quiz not found');
        }
        res.json({
            quizId,
            QuizTitle,
            Description,
            Duration,
            TeacherID,
            CourseID,
            StartTime,
        });
    } catch (error) {
        console.error('Error updating quiz:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Delete Quiz

export const deleteQuiz = async (req, res) => {
    try {
        const quizId = req.params.id;

        const deleteQuizSql = `DELETE FROM Quizzes WHERE QuizID = ?`;
        const result = await new Promise((resolve, reject) => {
            db.run(deleteQuizSql, [quizId], function (err) {
                if (err) reject(err);
                else resolve(this.changes);
            });
        });

        if (result === 0) {
            return res.status(404).send('Quiz not found');
        }
        res.json({ message: 'Quiz deleted successfully' });
    } catch (error) {
        console.error('Error deleting quiz:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
