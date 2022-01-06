const express = require('express')
require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')
const { ObjectId } = require('mongodb')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

app.post('/users', async ({ body }, res) => {
    const user = new User(body)
    try {
        await user.save()
        return res.status(201).send('New User saved with name ' + user.name)
    } catch (error) {
        return res.status(400).send(error)
    }
})


app.post('/tasks', async ({ body }, res) => {
    const task = new Task(body)

    try {
        await task.save()
        return res.status(201).send('New Task saved with name ' + task.name)
    } catch (error) {
        return res.status(400).send(error.message)
    }
})

app.get('/users', async (req, res) => {

    try {
        const users = await User.find({})
        return res.status(200).send(users)
    } catch (error) {
        return res.status(500).send()
    }

})

app.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find({})
        return res.status(200).send(tasks)
    } catch (error) {
        return res.status(500).send()
    }

})


app.get('/tasks/:id', async ({ params }, res) => {
    const _id = params.id

    try {
        const task = await Task.findById(_id)
        if (!task) {
            return res.status(404).send('Could not find a task with ID: ' + _id)
        }
        return res.status(200).send(task)
    } catch (error) {
        return res.status(500).send(error.message)
    }
})


app.get('/users/:id', async ({ params }, res) => {
    const _id = params.id

    try {
        const user = await User.findById(_id)
        if (!user) {
            return res.status(404).send('Could not find a user with ID: ' + _id)
        }
        return res.status(200).send(user)
    } catch (error) {
        return res.status(500).send(error.message)
    }
})

app.listen(port, () => {
    console.log('Server is running on ' + port)
})