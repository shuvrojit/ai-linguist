import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import userService from '../services/user.service';
import { ApiResponse } from '../types';
import { IUser } from '../models/user.model';

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.createUser(req.body);
  const response: ApiResponse<Omit<IUser, 'password'>> = {
    success: true,
    data: {
      ...user.toObject(),
      password: undefined,
    },
  };
  res.status(201).json(response);
});

export const getUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.getUserById(req.params.id);
  const response: ApiResponse<Omit<IUser, 'password'>> = {
    success: true,
    data: {
      ...user!.toObject(),
      password: undefined,
    },
  };
  res.status(200).json(response);
});

export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  const { users, total } = await userService.getUsers(page, limit);
  const response: ApiResponse<{
    users: Omit<IUser, 'password'>[];
    total: number;
  }> = {
    success: true,
    data: {
      users: users.map((user) => ({
        ...user.toObject(),
        password: undefined,
      })),
      total,
    },
  };
  res.status(200).json(response);
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.updateUser(req.params.id, req.body);
  const response: ApiResponse<Omit<IUser, 'password'>> = {
    success: true,
    data: {
      ...user!.toObject(),
      password: undefined,
    },
  };
  res.status(200).json(response);
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  await userService.deleteUser(req.params.id);
  const response: ApiResponse = {
    success: true,
  };
  res.status(200).json(response);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await userService.authenticateUser(email, password);
  const response: ApiResponse<Omit<IUser, 'password'>> = {
    success: true,
    data: {
      ...user.toObject(),
      password: undefined,
    },
  };
  res.status(200).json(response);
});
