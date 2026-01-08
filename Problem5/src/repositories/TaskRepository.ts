import Database from '../database';
import { Task, CreateTaskDTO, UpdateTaskDTO, TaskFilters } from '../types';
import { InternalServerError } from '../utils/AppError';

export class TaskRepository {
  private db: Database;

  constructor() {
    this.db = Database.getInstance();
  }

  async create(taskData: CreateTaskDTO): Promise<Task> {
    const { title, description = null, status = 'pending', priority = 'medium' } = taskData;

    const query = `
      INSERT INTO tasks (title, description, status, priority)
      VALUES (?, ?, ?, ?)
    `;

    try {
      const result = await this.db.run(query, [title, description, status, priority]);
      const task = await this.findById(result.lastID);

      if (!task) {
        throw new InternalServerError('Failed to create task');
      }

      return task;
    } catch (error) {
      throw new InternalServerError(`Failed to create task: ${(error as Error).message}`);
    }
  }

  async findAll(filters: TaskFilters = {}): Promise<{ tasks: Task[]; total: number }> {
    let query = 'SELECT * FROM tasks WHERE 1=1';
    let countQuery = 'SELECT COUNT(*) as total FROM tasks WHERE 1=1';
    const params: any[] = [];

    if (filters.status) {
      query += ' AND status = ?';
      countQuery += ' AND status = ?';
      params.push(filters.status);
    }

    if (filters.priority) {
      query += ' AND priority = ?';
      countQuery += ' AND priority = ?';
      params.push(filters.priority);
    }

    if (filters.search) {
      query += ' AND (title LIKE ? OR description LIKE ?)';
      countQuery += ' AND (title LIKE ? OR description LIKE ?)';
      const searchParam = `%${filters.search}%`;
      params.push(searchParam, searchParam);
    }

    query += ' ORDER BY created_at DESC';

    if (filters.limit) {
      query += ' LIMIT ?';
      params.push(filters.limit);
    }

    if (filters.offset) {
      query += ' OFFSET ?';
      params.push(filters.offset);
    }

    try {
      const tasks = await this.db.all<Task>(query, params);
      const countResult = await this.db.get<{ total: number }>(
        countQuery,
        params.slice(0, filters.limit ? params.length - 2 : params.length)
      );

      return {
        tasks,
        total: countResult?.total || 0,
      };
    } catch (error) {
      throw new InternalServerError(`Failed to fetch tasks: ${(error as Error).message}`);
    }
  }

  async findById(id: number): Promise<Task | null> {
    const query = 'SELECT * FROM tasks WHERE id = ?';

    try {
      const task = await this.db.get<Task>(query, [id]);
      return task || null;
    } catch (error) {
      throw new InternalServerError(`Failed to fetch task: ${(error as Error).message}`);
    }
  }

  async update(id: number, updates: UpdateTaskDTO): Promise<Task | null> {
    const fields: string[] = [];
    const values: any[] = [];

    if (updates.title !== undefined) {
      fields.push('title = ?');
      values.push(updates.title);
    }

    if (updates.description !== undefined) {
      fields.push('description = ?');
      values.push(updates.description);
    }

    if (updates.status !== undefined) {
      fields.push('status = ?');
      values.push(updates.status);
    }

    if (updates.priority !== undefined) {
      fields.push('priority = ?');
      values.push(updates.priority);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const query = `UPDATE tasks SET ${fields.join(', ')} WHERE id = ?`;

    try {
      const result = await this.db.run(query, values);

      if (result.changes === 0) {
        return null;
      }

      return this.findById(id);
    } catch (error) {
      throw new InternalServerError(`Failed to update task: ${(error as Error).message}`);
    }
  }

  async delete(id: number): Promise<boolean> {
    const query = 'DELETE FROM tasks WHERE id = ?';

    try {
      const result = await this.db.run(query, [id]);
      return result.changes > 0;
    } catch (error) {
      throw new InternalServerError(`Failed to delete task: ${(error as Error).message}`);
    }
  }

  async exists(id: number): Promise<boolean> {
    const query = 'SELECT 1 FROM tasks WHERE id = ? LIMIT 1';

    try {
      const result = await this.db.get<{ 1: number }>(query, [id]);
      return !!result;
    } catch (error) {
      throw new InternalServerError(`Failed to check task existence: ${(error as Error).message}`);
    }
  }
}
