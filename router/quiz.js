import { Router } from 'express';
import * as controller from '../controller/quiz.js';

const router = Router();

// Create a new quiz
router.post('/', controller.createQuiz);

// Get all quizzes
router.get('/all', controller.getQuizzes);

// Get a quiz by ID
router.get('/:id', controller.getQuizById);
// Get a quiz by courseID
router.get('/course/:id', controller.getQuizByCourseId);

// Update a quiz
router.put('/:id', controller.updateQuiz);

// Delete a quiz
router.delete('/:id', controller.deleteQuiz);

export default router;
