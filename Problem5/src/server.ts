import express, { Application, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import config from './config';
import Database from './database';
import logger from './utils/logger';
import taskRoutes from './routes/taskRoutes';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';
import { requestLogger } from './middlewares/requestLogger';

class Server {
  private app: Application;
  private db: Database;

  constructor() {
    this.app = express();
    this.db = Database.getInstance();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    // Security middleware
    this.app.use(helmet());

    // CORS
    this.app.use(
      cors({
        origin: config.cors.origin,
        credentials: config.cors.credentials,
      })
    );

    // Rate limiting
    const limiter = rateLimit({
      windowMs: config.rateLimit.windowMs,
      max: config.rateLimit.max,
      message: 'Too many requests from this IP, please try again later.',
      standardHeaders: true,
      legacyHeaders: false,
    });
    this.app.use('/api', limiter);

    // Compression
    this.app.use(compression());

    // Body parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Request logging
    this.app.use(requestLogger);

    // Trust proxy
    this.app.set('trust proxy', 1);
  }

  private initializeRoutes(): void {
    // Health check endpoint
    this.app.get('/health', (res: Response) => {
      res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: config.nodeEnv,
      });
    });

    // API documentation endpoint
    this.app.get('/api', (res: Response) => {
      res.status(200).json({
        success: true,
        message: 'Task Management API',
        version: '1.0.0',
        endpoints: {
          tasks: {
            create: 'POST /api/tasks',
            list: 'GET /api/tasks',
            get: 'GET /api/tasks/:id',
            update: 'PUT /api/tasks/:id',
            delete: 'DELETE /api/tasks/:id',
          },
        },
      });
    });

    // API Routes
    this.app.use('/api', taskRoutes);
  }

  private initializeErrorHandling(): void {
    // 404 handler
    this.app.use(notFoundHandler);

    // Global error handler
    this.app.use(errorHandler);
  }

  public async start(): Promise<void> {
    try {
      // Initialize database
      await this.db.initialize();

      // Start server
      this.app.listen(config.port, () => {
        logger.info(`Server started successfully`, {
          port: config.port,
          environment: config.nodeEnv,
          url: `http://localhost:${config.port}`,
        });
        logger.info(`API documentation available at: http://localhost:${config.port}/api`);
        logger.info(`Health check available at: http://localhost:${config.port}/health`);
      });
    } catch (error) {
      logger.error('Failed to start server:', error);
      process.exit(1);
    }
  }

  public getApp(): Application {
    return this.app;
  }
}

// Graceful shutdown
const gracefulShutdown = async (): Promise<void> => {
  logger.info('Received shutdown signal, closing server gracefully...');

  try {
    const db = Database.getInstance();
    await db.close();
    logger.info('Database connection closed');
    process.exit(0);
  } catch (error) {
    logger.error('Error during shutdown:', error);
    process.exit(1);
  }
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Unhandled rejection handler
process.on('unhandledRejection', (reason: Error) => {
  logger.error('Unhandled Rejection:', reason);
  throw reason;
});

process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Start server
if (require.main === module) {
  const server = new Server();
  server.start();
}

export default Server;
