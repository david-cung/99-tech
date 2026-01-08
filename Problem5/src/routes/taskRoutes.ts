import express from 'express';
import { TaskController } from '../controllers/taskController';
import {
  createTaskValidation,
  updateTaskValidation,
  getTaskByIdValidation,
  deleteTaskValidation,
  listTasksValidation,
} from '../validators/taskValidator';

const router = express.Router();
const taskController = new TaskController();

/**
 * @route   POST /api/tasks
 * @desc    Create a new task
 * @access  Public
 */
router.post('/tasks', createTaskValidation, taskController.createTask);

/**
 * @route   GET /api/tasks
 * @desc    Get all tasks with optional filters
 * @access  Public
 */
router.get('/tasks', listTasksValidation, taskController.getAllTasks);

/**
 * @route   GET /api/tasks/:id
 * @desc    Get a specific task by ID
 * @access  Public
 */
router.get('/tasks/:id', getTaskByIdValidation, taskController.getTaskById);

/**
 * @route   PUT /api/tasks/:id
 * @desc    Update a task
 * @access  Public
 */
router.put('/tasks/:id', updateTaskValidation, taskController.updateTask);

/**
 * @route   PATCH /api/tasks/:id
 * @desc    Partially update a task
 * @access  Public
 */
router.patch('/tasks/:id', updateTaskValidation, taskController.updateTask);

/**
 * @route   DELETE /api/tasks/:id
 * @desc    Delete a task
 * @access  Public
 */
router.delete('/tasks/:id', deleteTaskValidation, taskController.deleteTask);

export default router;
