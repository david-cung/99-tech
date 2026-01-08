import { Request, Response } from 'express';
import { AppError } from '../utils/AppError';
import logger from '../utils/logger';
import config from '../config';

export const errorHandler = (err: Error | AppError, req: Request, res: Response): void => {
  let statusCode = 500;
  let message = 'Internal server error';
  let isOperational = false;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    isOperational = err.isOperational;
  }

  // Log error
  if (!isOperational || statusCode === 500) {
    logger.error('Error occurred:', {
      message: err.message,
      stack: err.stack,
      url: req.url,
      method: req.method,
      ip: req.ip,
      statusCode,
    });
  } else {
    logger.warn('Operational error:', {
      message: err.message,
      url: req.url,
      method: req.method,
      statusCode,
    });
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    message,
    error: config.nodeEnv === 'development' ? err.message : undefined,
    stack: config.nodeEnv === 'development' ? err.stack : undefined,
  });
};

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.url} not found`,
  });
};
