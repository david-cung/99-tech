import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import config from './config';
import logger from './utils/logger';

class Database {
  private db: sqlite3.Database;
  private static instance: Database;

  private constructor() {
    this.db = new sqlite3.Database(config.database.filename, (err) => {
      if (err) {
        logger.error('Error opening database:', err);
        throw err;
      }
      logger.info(`Connected to SQLite database: ${config.database.filename}`);
    });

    this.db.run('PRAGMA foreign_keys = ON');
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public run(sql: string, params: any[] = []): Promise<{ lastID: number; changes: number }> {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function (err) {
        if (err) {
          logger.error('Database run error:', { sql, params, error: err.message });
          reject(err);
        } else {
          resolve({ lastID: this.lastID, changes: this.changes });
        }
      });
    });
  }

  public get<T>(sql: string, params: any[] = []): Promise<T | undefined> {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) {
          logger.error('Database get error:', { sql, params, error: err.message });
          reject(err);
        } else {
          resolve(row as T);
        }
      });
    });
  }

  public all<T>(sql: string, params: any[] = []): Promise<T[]> {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          logger.error('Database all error:', { sql, params, error: err.message });
          reject(err);
        } else {
          resolve(rows as T[]);
        }
      });
    });
  }

  public async close(): Promise<void> {
    return promisify(this.db.close.bind(this.db))();
  }

  public async initialize(): Promise<void> {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL CHECK(length(title) > 0),
        description TEXT,
        status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'in_progress', 'completed')),
        priority TEXT NOT NULL DEFAULT 'medium' CHECK(priority IN ('low', 'medium', 'high')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    const createIndexQuery = `
      CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
      CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
      CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at DESC);
    `;

    try {
      await this.run(createTableQuery);
      await this.run(createIndexQuery);
      logger.info('Database tables and indexes initialized successfully');
    } catch (error) {
      logger.error('Error initializing database:', error);
      throw error;
    }
  }
}

export default Database;
