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

const user3 = {
  username: 'emptyPost',
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

let newestDatePost: string;
let newestidPost: string;
let userToken: string;
let user2Token: string;
let user3Token: string;
let userId: string;
let user2Id: string;
let user3Id: string;

describe('TC-1: Registration & Login', () => {
  test('Positive: A new user2 successfully signs up (201)', async () => {
    const response = await request(app).post('/api/register').send(user2);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('username');
    expect(response.body.username).toEqual(user2.username);
    user2Id = response.body.id;
  });
  test('Positive: A new user3 successfully signs up (201)', async () => {
    const response = await request(app).post('/api/register').send(user3);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('username');
    expect(response.body.username).toEqual(user3.username);
    user3Id = response.body.id;
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
  test('Positive: A new user3 successfully login and return token (200)', async () => {
    const response = await request(app).post('/api/login').send(user3);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    user3Token = response.body.token;
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

describe('TC-3: Follow / Unfollow', () => {
  test('Positive: Follow a valid user -> saved in DB (200)', async () => {
    const response = await request(app)
      .post(`/api/follow/${user2Id}`)
      .set('Cookie', [`Authorization=Bearer ${userToken}`]); //user follow user2

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toEqual(
      `You are now following user ${user2Id}`,
    );
  });
  test('Negative: Follow a non-existent user -> (404).', async () => {
    const response = await request(app)
      .post(`/api/follow/${user2Id + 90909090}`)
      .set('Cookie', [`Authorization=Bearer ${userToken}`]); //user follow non exist user

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toEqual(`User not found`);
  });
});
describe('TC-4: Feed', () => {
  test('Positive: User2 Successfully creates a newest post ≤ 200 characters (201)', async () => {
    const response = await request(app)
      .post('/api/posts')
      .send(user2NewestContent)
      .set('Cookie', [`Authorization=Bearer ${user2Token}`]);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('content');
    expect(response.body).toHaveProperty('createdat');
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('userid');
    expect(response.body.userid).toEqual(user2Id);
    expect(response.body.content).toEqual(user2NewestContent.content);
    newestDatePost = response.body.createdat;
    newestDatePost = response.body.id;
  });
  test('Positive: Display posts from followed users, sorted by newest.', async () => {
    const response = await request(app)
      .get(`/api/feed?page=1&limit=10`)
      .set('Cookie', [`Authorization=Bearer ${userToken}`]); //user

    const newestPost = {
      content: user2NewestContent.content,
      username: user2.username,
      userid: user2Id,
    };

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('dataPerPage');
    expect(response.body).toHaveProperty('page');
    expect(response.body).toHaveProperty('posts');
    expect(response.body.posts).toBeInstanceOf(Array);
    expect(response.body.posts[0]).toHaveProperty('content'); // first array (newest)
    expect(response.body.posts[0].content).toEqual(newestPost.content);
    expect(response.body.posts[0]).toHaveProperty('createdat');
    expect(response.body.posts[0]).toHaveProperty('id');
    expect(response.body.posts[0]).toHaveProperty('userid');
    expect(response.body.posts[0].userid).toEqual(newestPost.userid);
    expect(response.body.posts[0]).toHaveProperty('username');
    expect(response.body.posts[0].username).toEqual(newestPost.username);
  });
  test('Negative: Not following anyone (user 3 is not following anyone) -> empty result', async () => {
    const response = await request(app)
      .get(`/api/feed?page=1&limit=10`)
      .set('Cookie', [`Authorization=Bearer ${user3Token}`]);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('dataPerPage');
    expect(response.body).toHaveProperty('page');
    expect(response.body).toHaveProperty('posts');
    expect(response.body.posts).toBeInstanceOf(Array);
    expect(response.body.posts).toHaveLength(0);
    expect(response.body.totalPage).toEqual(0);
  });
});
