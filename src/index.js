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
        res.status(201).send({ error: 'New User saved with name ' + user.name })
    } catch (error) {
        res.status(400).send(error)
    }
})

app.get('/users', async (req, res) => {

    try {
        const users = await User.find({})
        res.status(200).send(users)
    } catch (error) {
        res.status(500).send()
    }
})


app.get('/users/:id', async ({ params }, res) => {
    const _id = params.id

    try {
        const user = await User.findById(_id)
        if (!user) {
            return res.status(400).send({ error: 'Could not find a user with ID: ' + _id })
        }
        res.status(200).send(user)
    } catch (error) {
        res.status(500).send(error.message)
    }
})

app.patch('/users/:id', async ({ params, body }, res) => {
    const _id = params.id
    const allowedUpdates = ['name', 'email', 'age', 'password']
    const requestedUpdate = Object.keys(body)
    const isValidUpdate = requestedUpdate.every((update) => {
        return allowedUpdates.includes(update)
    })

    if (!isValidUpdate) {
        return res.status(400).send({ error: 'You are attempting to update a field that does not exist, or is not allowed to be updated. You may only update ' + allowedUpdates })
    }
    try {
        const user = await User.findByIdAndUpdate(_id, body, { new: true, runValidators: true })
        if (!user) {
            return res.status(404).send({ error: 'Could not find a user with ID: ' + _id })
        }
        res.status(200).send(user)
    } catch (error) {
        res.status(500).send(error.message)
    }
})

app.delete('/users/:id', async ({ params }, res) => {
    const _id = params.id

    try {
        const user = await User.findByIdAndDelete(_id)
        if (!user) {
            return res.status(404).send({ error: 'Could not find a user with ID: ' + _id })
        }
        res.status(200).send(user)
    } catch (error) {
        res.status(500).send(error.message)
    }
})

app.post('/tasks', async ({ body }, res) => {
    const task = new Task(body)

    try {
        await task.save()
        res.status(201).send('New Task saved with name ' + task.name)
    } catch (error) {
        res.status(400).send(error.message)
    }
})


app.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find({})
        res.status(200).send(tasks)
    } catch (error) {
        res.status(500).send()
    }

})


app.get('/tasks/:id', async ({ params }, res) => {
    const _id = params.id

    try {
        const task = await Task.findById(_id)
        if (!task) {
            return res.status(404).send({ error: 'Could not find a task with ID: ' + _id })
        }
        res.status(200).send(task)
    } catch (error) {
        res.status(500).send(error.message)
    }
})

app.patch('/tasks/:id', async ({ params, body }, res) => {
    const _id = params.id
    const allowedFields = ['name', 'description', 'completed']
    const requestedUpdate = Object.keys(body)
    const isValidUpdate = requestedUpdate.every((update) => {
        return allowedFields.includes(update)
    })

    if (!isValidUpdate) {
        return res.status(400).send({ error: 'Attempt to update on field that does not exist or is not updatable. You may only update ' + allowedFields })
    }
    try {
        const task = await Task.findByIdAndUpdate(_id, body, { new: true, runValidators: true })
        if (!task) {
            return res.status(404).send({ error: 'Could not find a task with ID: ' + _id })
        }
        res.status(200).send(task)
    } catch (error) {
        res.status(500).send(error.message)
    }
})

app.delete('/tasks/:id', async ({ params }, res) => {
    const _id = params.id

    try {
        const task = await Task.findByIdAndDelete(_id)
        if (!task) {
            return res.status(404).send({ error: 'Could not find a task with ID: ' + _id })
        }
        res.status(200).send(task)
    } catch (error) {
        res.status(500).send(error.message)
    }
})




app.listen(port, () => {
    console.log('Server is running on ' + port)
})