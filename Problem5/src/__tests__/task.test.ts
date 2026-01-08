import request from 'supertest';
import Server from '../server';
import Database from '../database';

const server = new Server();
const app = server.getApp();

describe('Task API Tests', () => {
  let taskId: number;

  beforeAll(async () => {
    const db = Database.getInstance();
    await db.initialize();
  });

  afterAll(async () => {
    const db = Database.getInstance();
    await db.close();
  });

  describe('POST /api/tasks', () => {
    it('should create a new task', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({
          title: 'Test Task',
          description: 'Test Description',
          priority: 'high',
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.title).toBe('Test Task');
      taskId = response.body.data.id;
    });

    it('should return 400 for invalid task data', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({
          title: '',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/tasks', () => {
    it('should return all tasks', async () => {
      const response = await request(app).get('/api/tasks').expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('pagination');
      expect(Array.isArray(response.body.data.data)).toBe(true);
    });

    it('should filter tasks by status', async () => {
      const response = await request(app).get('/api/tasks?status=pending').expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('GET /api/tasks/:id', () => {
    it('should return a task by id', async () => {
      const response = await request(app).get(`/api/tasks/${taskId}`).expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(taskId);
    });

    it('should return 404 for non-existent task', async () => {
      const response = await request(app).get('/api/tasks/99999').expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/tasks/:id', () => {
    it('should update a task', async () => {
      const response = await request(app)
        .put(`/api/tasks/${taskId}`)
        .send({
          title: 'Updated Task',
          status: 'completed',
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe('Updated Task');
      expect(response.body.data.status).toBe('completed');
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('should delete a task', async () => {
      const response = await request(app).delete(`/api/tasks/${taskId}`).expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should return 404 when deleting non-existent task', async () => {
      const response = await request(app).delete(`/api/tasks/${taskId}`).expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/health').expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body).toHaveProperty('uptime');
    });
  });
});
