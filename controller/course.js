import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./database.db');

// Create Course
export const createCourse = (req, res) => {
    try {
        // Extract data from the request body
        const { CourseName, TeacherID } = req.body;

        // Insert the course into the Courses table
        const insertCourseSql = `INSERT INTO Courses (CourseName, TeacherID) VALUES (?, ?)`;
        db.run(insertCourseSql, [CourseName, TeacherID], function (err) {
            if (err) {
                console.error('Error creating course:', err);
                res.status(500).send('Internal Server Error');
            } else {
                const courseId = this.lastID;
                res.status(201).json({ courseId });
                console.log('Course created successfully');
            }
        });
    } catch (error) {
        console.error('Error creating course:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Get Courses
export const getCourses = (req, res) => {
    try {
        // Retrieve all courses from the Courses table
        const selectCoursesSql = `SELECT * FROM Courses`;
        db.all(selectCoursesSql, (err, courses) => {
            if (err) {
                console.error('Error getting courses:', err);
                res.status(500).send('Internal Server Error');
            } else {
                res.json(courses);
            }
        });
    } catch (error) {
        console.error('Error getting courses:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Get Course by ID
export const getCourseById = (req, res) => {
    try {
        const courseId = req.params.id;

        // Retrieve a specific course by its ID
        const selectCourseSql = `SELECT * FROM Courses WHERE CourseID = ?`;
        db.get(selectCourseSql, [courseId], (err, course) => {
            if (err) {
                console.error('Error getting course:', err);
                res.status(500).send('Internal Server Error');
            } else if (!course) {
                res.status(404).send('Course not found');
            } else {
                res.json(course);
            }
        });
    } catch (error) {
        console.error('Error getting course:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Update Course
export const updateCourse = (req, res) => {
    try {
        const courseId = req.params.id;
        const { CourseName, TeacherID } = req.body;

        // Update the course in the Courses table
        const updateCourseSql = `UPDATE Courses SET CourseName = ?, TeacherID = ? WHERE CourseID = ?`;
        db.run(
            updateCourseSql,
            [CourseName, TeacherID, courseId],
            function (err) {
                if (err) {
                    console.error('Error updating course:', err);
                    res.status(500).json({ message: 'Internal Server Error' });
                } else if (this.changes === 0) {
                    res.status(404).send('Course not found');
                } else {
                    res.json({ courseId, CourseName, TeacherID });
                }
            }
        );
    } catch (error) {
        console.error('Error updating course:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Delete Course
export const deleteCourse = (req, res) => {
    try {
        const courseId = req.params.id;

        // Delete the course from the Courses table
        const deleteCourseSql = `DELETE FROM Courses WHERE CourseID = ?`;
        db.run(deleteCourseSql, [courseId], function (err) {
            if (err) {
                console.error('Error deleting course:', err);
                res.status(500).json({ message: 'Internal Server Error' });
            } else if (this.changes === 0) {
                res.status(404).send('Course not found');
            } else {
                res.json({ message: 'Course deleted successfully' });
            }
        });
    } catch (error) {
        console.error('Error deleting course:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
