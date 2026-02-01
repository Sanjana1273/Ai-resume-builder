import express from 'express';
import { getUserById, getUserResume, loginUser, registerUser } from '../controllers/userController';
import protect from '../middleware/authMiddleware';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/data', protect , getUserById);
userRouter.get('/resumes', protect , getUserResume);

export default userRouter