// import test from 'node:test';
import request from 'supertest';
import app from '../app';
import { describe, test, expect } from '@jest/globals';

const user = {
  username: 'admin',
  password: '12345',
};

const userContent = {
  content: 'Apakabar duniaaaaa',
};

let userToken: string;
let userId: string;

describe('TC-1: Registration & Login', () => {
  test('Positive: A new user successfully signs up (201)', async () => {
    const response = await request(app).post('/api/register').send(user);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('username');
    expect(response.body.username).toEqual(user.username);
    userId = response.body.id;
  });
  test('Positive: A new user successfully login and return token (200)', async () => {
    const response = await request(app).post('/api/login').send(user);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    userToken = response.body.token;
  });
  test('Negative: Duplicate Simple Wireframe Login/Register username (409)', async () => {
    const response = await request(app).post('/api/register').send(user);
    expect(response.status).toBe(409);
    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('success');
    expect(response.body.message).toEqual('Username already exists');
    expect(response.body.success).toEqual(false);
  });
});

describe('TC-2: Create Post', () => {
  test('Positive: Successfully creates a post ≤ 200 characters', async () => {
    const response = await request(app)
      .post('/api/posts')
      .send(userContent)
      .set('Cookie', [`Authorization=Bearer ${userToken}`]);
    console.log(userToken);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('content');
    expect(response.body).toHaveProperty('createdat');
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('userid');
    expect(response.body.userid).toEqual(userId);
    expect(response.body.content).toEqual(userContent.content);
  });
});
