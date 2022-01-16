const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../../../src/models/user')
const Task = require('../../../src/models/task')


const testUserId = new mongoose.Types.ObjectId()

const testUser = {
  _id: testUserId,
  name: 'Testing',
  email: 'node@ryanralphs.co.uk',
  password: 'secretsaresecret123',
  tokens: [{
    token: jwt.sign({ _id: testUserId }, process.env.JWT_SECRET)
  }]
}


const testUserTwoId = new mongoose.Types.ObjectId()

const testUserTwo = {
  _id: testUserTwoId,
  name: 'Testing two',
  email: 'node2@ryanralphs.co.uk',
  password: 'secretsaresecret123',
  tokens: [{
    token: jwt.sign({ _id: testUserTwoId }, process.env.JWT_SECRET)
  }]
}


const testTask = {
    _id: new mongoose.Types.ObjectId(),
    name: 'TestOne',
    description: 'Test Description One',
    owner: testUser._id
}

const testTaskTwo = {
    _id: new mongoose.Types.ObjectId(),
    name: 'TestTwo',
    description: 'Test Description two',
    completed: true,
    owner: testUser._id
}

const testTaskThree = {
    _id: new mongoose.Types.ObjectId(),
    name: 'TestThree',
    description: 'Test Description Three',
    completed: true,
    owner: testUserTwo._id
}

const populateDatabase = async () => {
    await User.deleteMany()
    await Task.deleteMany()
    await new User(testUser).save()
    await new User(testUserTwo).save()
    await new Task(testTask).save()
    await new Task(testTaskTwo).save()
    await new Task(testTaskThree).save()

}

module.exports = {
    testUserId,
    testUser,
    populateDatabase,
    testUserTwo,
    testTask
}