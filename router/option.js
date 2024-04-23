import { Router } from 'express';
import * as controller from '../controller/option.js';
const router = Router();

// Create a new option
router.post('/', controller.createOption);

// Get options by question ID
router.get('/questions/:id/options', controller.getOptionsByQuestionId);

// Update an option
router.put('/:id', controller.updateOption);
router.get('/quizzes/:id/options', controller.getCorrectOptionsByQuizId);

// Delete an option
router.delete('/:id', controller.deleteOption);

export default router;
