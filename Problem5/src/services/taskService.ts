import { TaskRepository } from '../repositories/TaskRepository';
import { Task, CreateTaskDTO, UpdateTaskDTO, TaskFilters, PaginatedResponse } from '../types';
import { NotFoundError, ValidationError } from '../utils/AppError';
import logger from '../utils/logger';

export class TaskService {
  private taskRepository: TaskRepository;

  constructor() {
    this.taskRepository = new TaskRepository();
  }

  async createTask(taskData: CreateTaskDTO): Promise<Task> {
    this.validateCreateTaskData(taskData);

    logger.info('Creating new task', { title: taskData.title });

    const task = await this.taskRepository.create(taskData);

    logger.info('Task created successfully', { id: task.id });

    return task;
  }

  async getAllTasks(filters: TaskFilters = {}): Promise<PaginatedResponse<Task>> {
    const limit = filters.limit || 10;
    const offset = filters.offset || 0;

    logger.debug('Fetching tasks with filters', { filters });

    const { tasks, total } = await this.taskRepository.findAll({
      ...filters,
      limit,
      offset,
    });

    return {
      data: tasks,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    };
  }

  async getTaskById(id: number): Promise<Task> {
    logger.debug('Fetching task by ID', { id });

    const task = await this.taskRepository.findById(id);

    if (!task) {
      logger.warn('Task not found', { id });
      throw new NotFoundError(`Task with ID ${id} not found`);
    }

    return task;
  }

  async updateTask(id: number, updates: UpdateTaskDTO): Promise<Task> {
    this.validateUpdateTaskData(updates);

    logger.info('Updating task', { id, updates });

    const task = await this.taskRepository.update(id, updates);

    if (!task) {
      logger.warn('Task not found for update', { id });
      throw new NotFoundError(`Task with ID ${id} not found`);
    }

    logger.info('Task updated successfully', { id });

    return task;
  }

  async deleteTask(id: number): Promise<void> {
    logger.info('Deleting task', { id });

    const deleted = await this.taskRepository.delete(id);

    if (!deleted) {
      logger.warn('Task not found for deletion', { id });
      throw new NotFoundError(`Task with ID ${id} not found`);
    }

    logger.info('Task deleted successfully', { id });
  }

  private validateCreateTaskData(data: CreateTaskDTO): void {
    if (!data.title || data.title.trim().length === 0) {
      throw new ValidationError('Title is required and cannot be empty');
    }

    if (data.title.length > 255) {
      throw new ValidationError('Title must not exceed 255 characters');
    }

    if (data.description && data.description.length > 1000) {
      throw new ValidationError('Description must not exceed 1000 characters');
    }
  }

  private validateUpdateTaskData(data: UpdateTaskDTO): void {
    if (data.title !== undefined && data.title.trim().length === 0) {
      throw new ValidationError('Title cannot be empty');
    }

    if (data.title && data.title.length > 255) {
      throw new ValidationError('Title must not exceed 255 characters');
    }

    if (data.description && data.description.length > 1000) {
      throw new ValidationError('Description must not exceed 1000 characters');
    }

    if (Object.keys(data).length === 0) {
      throw new ValidationError('At least one field must be provided for update');
    }
  }
}
