import express from 'express';
import {
  createUser,
  getUser,
  getUsers,
  updateUser,
  deleteUser,
  login,
} from '../../controllers/user.controller';

const userRouter = express.Router();

// Auth routes
userRouter.post('/register', createUser);
userRouter.post('/login', login);

// User management routes
userRouter.get('/', getUsers);
userRouter.get('/:id', getUser);
userRouter.patch('/:id', updateUser);
userRouter.delete('/:id', deleteUser);

export default userRouter;
