import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./database.db');

// Create Course
export const createCourse = async (req, res) => {
    try {
        const { CourseName, TeacherID } = req.body;
        const insertCourseSql = `INSERT INTO Courses (CourseName, TeacherID) VALUES (?, ?)`;

        const courseId = await new Promise((resolve, reject) => {
            db.run(insertCourseSql, [CourseName, TeacherID], function (err) {
                if (err) reject(err);
                else resolve(this.lastID);
            });
        });

        res.status(201).json({ courseId });
        console.log('Course created successfully');
    } catch (error) {
        console.error('Error creating course:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Get Courses
export const getCourses = async (req, res) => {
    try {
        const selectCoursesSql = `SELECT * FROM Courses`;

        const courses = await new Promise((resolve, reject) => {
            db.all(selectCoursesSql, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });

        res.json(courses);
    } catch (error) {
        console.error('Error getting courses:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Get Course by ID
export const getCourseById = async (req, res) => {
    try {
        const courseId = req.params.id;
        const selectCourseSql = `SELECT * FROM Courses WHERE CourseID = ?`;

        const course = await new Promise((resolve, reject) => {
            db.get(selectCourseSql, [courseId], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });

        if (!course) {
            res.status(404).send('Course not found');
        } else {
            res.json(course);
        }
    } catch (error) {
        console.error('Error getting course:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Update Course
export const updateCourse = async (req, res) => {
    try {
        const courseId = req.params.id;
        const { CourseName, TeacherID } = req.body;
        const updateCourseSql = `UPDATE Courses SET CourseName = ?, TeacherID = ? WHERE CourseID = ?`;

        const result = await new Promise((resolve, reject) => {
            db.run(
                updateCourseSql,
                [CourseName, TeacherID, courseId],
                function (err) {
                    if (err) reject(err);
                    else resolve(this.changes);
                }
            );
        });

        if (result === 0) {
            res.status(404).send('Course not found');
        } else {
            res.json({ courseId, CourseName, TeacherID });
        }
    } catch (error) {
        console.error('Error updating course:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Delete Course
export const deleteCourse = async (req, res) => {
    try {
        const courseId = req.params.id;
        const deleteCourseSql = `DELETE FROM Courses WHERE CourseID = ?`;

        const result = await new Promise((resolve, reject) => {
            db.run(deleteCourseSql, [courseId], function (err) {
                if (err) reject(err);
                else resolve(this.changes);
            });
        });

        if (result === 0) {
            res.status(404).send('Course not found');
        } else {
            res.json({ message: 'Course deleted successfully' });
        }
    } catch (error) {
        console.error('Error deleting course:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
