const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')

const testUser = new User({
  name: 'Testing',
  email: 'node@ryanralphs.co.uk',
  password: 'secretsaresecret123'
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

  await request(app)
    .post('/users')
    .send({
      name: newUser.name,
      email: newUser.email,
      password: newUser.password
    }).expect(201).then(({ body }) => {
      expect(body.user.name).toBe(newUser.name)
    })
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
    }).expect(400).then(({ text }) => {
      expect(text).toBe(`Cannot find user with email of ${invalidUser.email}`)
    })
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