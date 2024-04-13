import { Router } from 'express';
import * as controller from '../controller/course.js';
const router = Router();

//API routes of events
// Create a new course
router.post('/', controller.createCourse);

// Get all courses
router.get('/all', controller.getCourses);

// Get a course by ID
router.get('/:id', controller.getCourseById);

// Update a course
router.put('/:id', controller.updateCourse);

// Delete a course
router.delete('/:id', controller.deleteCourse);

export default router;
