// import test from 'node:test';
import request from 'supertest';
import app from '../app';
import { describe, test, expect } from '@jest/globals';

const user = {
  username: 'admin',
  password: '12345',
};

const user2 = {
  username: 'followedByAdmin',
  password: '12345',
};

const userContent = {
  content: 'Apakabar duniaaaaa',
};

const charReject = {
  content:
    'eysoisanzxeuvdbcpkogacohxxxgvvexjsqdehuobcoduisuazwhwtjypytprgyh syleupwedatwqbeqijkvhvelrdxfvktnapozrwnxqpayfdumvkbydwfpdsksgayxbqobmzfsrsfxiyregrrubegizrnsajagoikaqglvglizjzyqfriaqlcvfhxwsytdsfioewitv',
}; //201 character

const user2OldestContent = {
  content: 'old',
};
const user2NewestContent = {
  content: 'newest',
};

let userToken: string;
let user2Token: string;
let userId: string;
let user2Id: string;

describe('TC-1: Registration & Login', () => {
  test('Positive: A new user2 successfully signs up (201)', async () => {
    const response = await request(app).post('/api/register').send(user2);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('username');
    expect(response.body.username).toEqual(user2.username);
    user2Id = response.body.id;
  });
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
  test('Positive: A new user2 successfully login and return token (200)', async () => {
    const response = await request(app).post('/api/login').send(user2);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    user2Token = response.body.token;
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
  test('Positive: Successfully creates a post ≤ 200 characters (201)', async () => {
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
  test('Positive: User2 Successfully creates a oldest post ≤ 200 characters (201)', async () => {
    const response = await request(app)
      .post('/api/posts')
      .send(user2OldestContent)
      .set('Cookie', [`Authorization=Bearer ${user2Token}`]);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('content');
    expect(response.body).toHaveProperty('createdat');
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('userid');
    expect(response.body.userid).toEqual(user2Id);
    expect(response.body.content).toEqual(user2OldestContent.content);
  });
  test('Negative: Content > 200 characters -> (422)', async () => {
    const response = await request(app)
      .post('/api/posts')
      .send(charReject)
      .set('Cookie', [`Authorization=Bearer ${userToken}`]);
    console.log(userToken);

    expect(response.status).toBe(422);
    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('success');
    expect(response.body.message).toEqual('Column character limit has reached');
    expect(response.body.success).toEqual(false);
  });
});
