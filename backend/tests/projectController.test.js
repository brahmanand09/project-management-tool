jest.setTimeout(30000); // increase test timeout for MongoDB Memory Server

const mongoose = require('mongoose');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const { MongoMemoryServer } = require('mongodb-memory-server');

const app = require('../app'); // ✅ import app (not server.js)
const Project = require('../models/Project');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Project Controller', () => {
  let userId;
  let token;

  beforeEach(async () => {
    await Project.deleteMany({});
    userId = new mongoose.Types.ObjectId();
    token = jwt.sign({ user: { id: userId } }, process.env.JWT_SECRET);
  });

  it('should get projects with pagination and search', async () => {
    await Project.create([
      { user: userId, title: 'Test Project 1', description: 'Desc 1', status: 'active' },
      { user: userId, title: 'Another Project', description: 'Desc 2', status: 'completed' }
    ]);

    const res = await request(app)
      .get('/api/projects?page=1&limit=1&search=Test')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.projects).toHaveLength(1);
    expect(res.body.projects[0].title).toBe('Test Project 1');
    expect(res.body.total).toBe(1);
  });

  it('should create a project', async () => {
    const res = await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'New Project', description: 'New Desc', status: 'active' });

    expect(res.status).toBe(201);
    expect(res.body.title).toBe('New Project');
  });
});
