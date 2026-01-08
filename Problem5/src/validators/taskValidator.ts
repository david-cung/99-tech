import { body, param, query, ValidationChain } from 'express-validator';
import { TaskStatus, TaskPriority } from '../types';

export const createTaskValidation: ValidationChain[] = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 255 })
    .withMessage('Title must not exceed 255 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must not exceed 1000 characters'),
  body('status').optional().isIn(Object.values(TaskStatus)).withMessage('Invalid status value'),
  body('priority')
    .optional()
    .isIn(Object.values(TaskPriority))
    .withMessage('Invalid priority value'),
];

export const updateTaskValidation: ValidationChain[] = [
  param('id').isInt({ min: 1 }).withMessage('Invalid task ID'),
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty')
    .isLength({ max: 255 })
    .withMessage('Title must not exceed 255 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must not exceed 1000 characters'),
  body('status').optional().isIn(Object.values(TaskStatus)).withMessage('Invalid status value'),
  body('priority')
    .optional()
    .isIn(Object.values(TaskPriority))
    .withMessage('Invalid priority value'),
];

export const getTaskByIdValidation: ValidationChain[] = [
  param('id').isInt({ min: 1 }).withMessage('Invalid task ID'),
];

export const deleteTaskValidation: ValidationChain[] = [
  param('id').isInt({ min: 1 }).withMessage('Invalid task ID'),
];

export const listTasksValidation: ValidationChain[] = [
  query('status').optional().isIn(Object.values(TaskStatus)).withMessage('Invalid status value'),
  query('priority')
    .optional()
    .isIn(Object.values(TaskPriority))
    .withMessage('Invalid priority value'),
  query('search').optional().trim().isLength({ max: 100 }).withMessage('Search term too long'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('offset').optional().isInt({ min: 0 }).withMessage('Offset must be a non-negative integer'),
];
