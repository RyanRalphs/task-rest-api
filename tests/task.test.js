const { ObjectId } = require('mongodb')
const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/task')
const { testUserId, testUser, populateDatabase, testTask, testUserTwo} = require('./fixtures/db/db')


beforeEach(populateDatabase)

test('Should create a task for user', async () => {
  const res = await request(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
    .send({
      name: 'Task 1',
      description: 'Tests'
    }).expect(201)



  const task = await Task.findById(res.body._id)
  expect(task).not.toBeNull()
  expect(task.completed).toBe(false)
})

test('I can get tasks for a user', async () => {
  await request(app)
    .get('/tasks')
    .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
    .send()
    .expect(200)
    .then(({ body }) => {
      expect(body.length).toBe(2)
    })
})

test('A user cannot delete a task they do not own', async () => {
  await request(app)
      .delete(`/tasks/${testTask._id}`)
      .set('Authorization', `Bearer ${testUserTwo.tokens[0].token}`)
      .send()
      .expect(404)

      const task = Task.findById(testTask._id)
      expect(task).not.toBeNull()
})