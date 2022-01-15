const request = require('supertest')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const app = require('../src/app')
const User = require('../src/models/user')
const fs = require('fs')

const testUserId = new mongoose.Types.ObjectId()

const testUser = new User({
  _id: testUserId,
  name: 'Testing',
  email: 'node@ryanralphs.co.uk',
  password: 'secretsaresecret123',
  tokens: [{
    token: jwt.sign({ _id: testUserId }, process.env.JWT_SECRET)
  }]
})

beforeEach(async () => {
  await User.deleteMany()
  await new User(testUser).save()
})

test('Should sign up a new user', async () => {

  const newUser = {
    name: 'Ryan',
    email: 'dev@ryanralphs.co.uk',
    password: 'secret123'
  }

  const res = await request(app)
    .post('/users')
    .send({
      name: newUser.name,
      email: newUser.email,
      password: newUser.password
    }).expect(201)

  const user = await User.findById(res.body.user._id)
  expect(user).not.toBeNull()


  expect(res.body).toMatchObject({
    user: {
      name: newUser.name,
      email: newUser.email
    },
    token: user.tokens[0].token
  })

  expect(user.password).not.toBe(newUser.password)
})


test('Should not log in non existant user', async () => {

  const invalidUser = {
    email: 'notValid@ryanralphs.co.uk',
    password: 'Thisdoesnotmatter'
  }

  await request(app)
    .post('/users/login')
    .send({
      email: invalidUser.email,
      password: invalidUser.password
    }).expect(400)
})

test('Should login a user', async () => {
  await request(app)
    .post('/users/login')
    .send({
      email: testUser.email,
      password: testUser.password
    }).expect(200).then(({ body }) => {
      expect(body.user.name).toBe(testUser.name)
      expect(body.user.email).toBe(testUser.email)
    })
})

test('Logging in a user creates a new session', async () => {
  const res = await request(app)
    .post('/users/login')
    .send({
      email: testUser.email,
      password: testUser.password
    }).expect(200)

  const user = await User.findById(res.body.user._id)
  expect(user).not.toBeNull()
  expect(user.tokens.length).toBe(2)
  expect(res.body.token).toBe(user.tokens[1].token)
})

test('I can access authentication based routes', async () => {
  await request(app)
    .get('/users/me')
    .set('Authorization', 'Bearer ' + testUser.tokens[0].token)
    .send()
    .expect(200)
})

test('Should not get profile for unauthenticated User', async () => {
  await request(app)
    .get('/users/me')
    .send()
    .expect(401)
})


test('Should delete account for user', async () => {
  await request(app)
    .delete('/users/me')
    .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
    .send()
    .expect(200)


  const deletedUser = await User.findById(testUserId)

  expect(deletedUser).toBeNull()

})

test('I can not delete what is not logged in', async () => {
  await request(app)
    .delete('/users/me')
    .send()
    .expect(401)
})
