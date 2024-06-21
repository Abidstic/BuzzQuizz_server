import sqlite3 from 'sqlite3';

// Function to run SQL command with async/await
const runSql = (db, sql) => {
    return new Promise((resolve, reject) => {
        db.run(sql, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

// Function to create database schema
const createSchema = async (db) => {
    try {
        // Create Users Table
        await runSql(
            db,
            `
            CREATE TABLE IF NOT EXISTS Users (
                UserID INTEGER PRIMARY KEY AUTOINCREMENT,
                Username VARCHAR(50) UNIQUE,
                Password VARCHAR(255),
                FirstName VARCHAR(50),
                LastName VARCHAR(50),
                Email VARCHAR(100),
                UserRole TEXT CHECK(UserRole IN ('student', 'teacher', 'admin'))
            )
        `
        );

        // Create Courses Table
        await runSql(
            db,
            `
            CREATE TABLE IF NOT EXISTS Courses (
                CourseID INTEGER PRIMARY KEY AUTOINCREMENT,
                CourseName VARCHAR(100),
                TeacherID INTEGER,
                FOREIGN KEY (TeacherID) REFERENCES Users(UserID)
            )
        `
        );

        // Create Enrollment Table
        await runSql(
            db,
            `
            CREATE TABLE IF NOT EXISTS Enrollment (
                EnrollmentID INTEGER PRIMARY KEY AUTOINCREMENT,
                StudentID INTEGER,
                CourseID INTEGER,
                FOREIGN KEY (StudentID) REFERENCES Users(UserID),
                FOREIGN KEY (CourseID) REFERENCES Courses(CourseID)
            )
        `
        );

        // Create Quizzes Table
        await runSql(
            db,
            `
            CREATE TABLE IF NOT EXISTS Quizzes (
                QuizID INTEGER PRIMARY KEY AUTOINCREMENT,
                QuizTitle VARCHAR(100),
                Description TEXT,
                Duration INT,
                TeacherID INTEGER,
                CourseID INTEGER,
                StartTime DATETIME,
                FOREIGN KEY (TeacherID) REFERENCES Users(UserID),
                FOREIGN KEY (CourseID) REFERENCES Courses(CourseID)
            )
        `
        );

        // Create Questions Table
        await runSql(
            db,
            `
            CREATE TABLE IF NOT EXISTS Questions (
                QuestionID INTEGER PRIMARY KEY AUTOINCREMENT,
                QuestionText TEXT,
                QuestionType TEXT CHECK(QuestionType IN ('multiple-choice', 'true/false', 'short answer')),
                QuizID INTEGER,
                FOREIGN KEY (QuizID) REFERENCES Quizzes(QuizID)
            )
        `
        );

        // Create Options Table
        await runSql(
            db,
            `
            CREATE TABLE IF NOT EXISTS Options (
                OptionID INTEGER PRIMARY KEY AUTOINCREMENT,
                OptionText TEXT,
                IsCorrect BOOLEAN,
                QuestionID INTEGER,
                FOREIGN KEY (QuestionID) REFERENCES Questions(QuestionID)
            )
        `
        );

        // Create Question_Quiz Table
        await runSql(
            db,
            `
            CREATE TABLE IF NOT EXISTS Question_Quiz (
                QuestionID INTEGER,
                QuizID INTEGER,
                FOREIGN KEY (QuestionID) REFERENCES Questions(QuestionID),
                FOREIGN KEY (QuizID) REFERENCES Quizzes(QuizID),
                PRIMARY KEY (QuestionID, QuizID)
            )
        `
        );

        // Create UserResponse Table
        await runSql(
            db,
            `
            CREATE TABLE IF NOT EXISTS UserResponse (
                ResponseID INTEGER PRIMARY KEY AUTOINCREMENT,
                UserID INTEGER,
                QuizID INTEGER,
                QuestionID INTEGER,
                ChosenOption INTEGER,
                AnswerText TEXT,
                IsCorrect BOOLEAN,
                FOREIGN KEY (UserID) REFERENCES Users(UserID),
                FOREIGN KEY (QuizID) REFERENCES Quizzes(QuizID),
                FOREIGN KEY (QuestionID) REFERENCES Questions(QuestionID),
                FOREIGN KEY (ChosenOption) REFERENCES Options(OptionID)
            )
        `
        );

        console.log('Database schema created successfully.');

        // Close the database connection
        db.close();
    } catch (error) {
        console.error('Error creating database schema:', error);
    }
};

export default createSchema;
