import { Router } from 'express';
import * as controller from '../controller/user.js';
import verifyToken from '../middleware/verifyToken.js';
const router = Router();

//API routes of events
router.post('/register', controller.registerUser);
router.post('/login', controller.loginUser);
router.get('/:id', verifyToken, controller.getUserById);
router.put('/:id', controller.updateUser);
router.delete('/:id', controller.deleteUser);

export default router;
