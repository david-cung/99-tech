import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { TaskService } from '../services/taskService';
import {
  CreateTaskDTO,
  UpdateTaskDTO,
  TaskFilters,
  ApiResponse,
  PaginatedResponse,
} from '../types';
import { asyncHandler } from '../utils/asyncHandler';
import { ValidationError } from '../utils/AppError';

export class TaskController {
  private taskService: TaskService;

  constructor() {
    this.taskService = new TaskService();
  }

  createTask = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ValidationError(errors.array()[0].msg);
    }

    const taskData: CreateTaskDTO = req.body;
    const task = await this.taskService.createTask(taskData);

    const response: ApiResponse<typeof task> = {
      success: true,
      message: 'Task created successfully',
      data: task,
    };

    res.status(201).json(response);
  });

  getAllTasks = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ValidationError(errors.array()[0].msg);
    }

    const filters: TaskFilters = {
      status: req.query.status as any,
      priority: req.query.priority as any,
      search: req.query.search as string,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      offset: req.query.offset ? parseInt(req.query.offset as string) : undefined,
    };

    const result = await this.taskService.getAllTasks(filters);

    const response: ApiResponse<PaginatedResponse<any>> = {
      success: true,
      message: 'Tasks retrieved successfully',
      data: result,
    };

    res.status(200).json(response);
  });

  getTaskById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ValidationError(errors.array()[0].msg);
    }

    const id = parseInt(req.params.id);
    const task = await this.taskService.getTaskById(id);

    const response: ApiResponse<typeof task> = {
      success: true,
      message: 'Task retrieved successfully',
      data: task,
    };

    res.status(200).json(response);
  });

  updateTask = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ValidationError(errors.array()[0].msg);
    }

    const id = parseInt(req.params.id);
    const updates: UpdateTaskDTO = req.body;

    const task = await this.taskService.updateTask(id, updates);

    const response: ApiResponse<typeof task> = {
      success: true,
      message: 'Task updated successfully',
      data: task,
    };

    res.status(200).json(response);
  });

  deleteTask = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ValidationError(errors.array()[0].msg);
    }

    const id = parseInt(req.params.id);
    await this.taskService.deleteTask(id);

    const response: ApiResponse<null> = {
      success: true,
      message: 'Task deleted successfully',
    };

    res.status(200).json(response);
  });
}
