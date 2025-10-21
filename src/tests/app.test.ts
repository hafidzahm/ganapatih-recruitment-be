// import test from 'node:test';
import request from 'supertest';
import app from '../app';
import { describe, test, expect } from '@jest/globals';

describe('app', () => {
  test('GET / should return 200 and heartbeat message', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message');
  });
});
