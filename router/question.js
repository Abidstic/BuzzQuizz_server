import { Router } from 'express';
import * as controller from '../controller/question.js';
const router = Router();

//API routes of events
// Create a new question
router.post('/', controller.createQuestion);

// Get questions by quiz ID
router.get('/quizzes/:id/questions', controller.getQuestionsByQuizId);

// Update a question
router.put('/:id', controller.updateQuestion);

// Delete a question
router.delete('/:id', controller.deleteQuestion);

export default router;
