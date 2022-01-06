const express = require('express')
require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')
const { ObjectId } = require('mongodb')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

app.post('/users', ({ body }, res) => {
    const newUser = new User(body)

    newUser.save().then((user) => {
        return res.status(201).send('New User saved with name ' + user.name)
    }).catch((error) => {
        return res.status(400).send(error.message)
    })
})


app.post('/tasks', ({ body }, res) => {
    const newTask = new Task(body)

    newTask.save().then((task) => {
        return res.status(201).send('New Task saved with name ' + task.name)
    }).catch((error) => {
        return res.status(400).send(error.message)
    })
})

app.get('/users', (req, res) => {
    User.find({}).then((allUsers) => {
        return res.status(200).send(allUsers)
    }).catch((error) => {
        return res.status(500).send()
    })
})

app.get('/tasks', (req, res) => {
    Task.find({}).then((allTasks) => {
        return res.status(200).send(allTasks)
    }).catch((error) => {
        return res.status(500).send()
    })
})


app.get('/tasks/:id', ({ params }, res) => {
    const _id = params.id

    Task.findById(_id).then((task) => {
        if (!task) {
            return res.status(404).send('Could not find a task with ID: ' + _id)
        }
        return res.status(200).send(task)
    }).catch((error) => {
        return res.status(500).send(error.message)
    })
})


app.get('/users/:id', ({ params }, res) => {
    const _id = params.id

    User.findById(_id).then((user) => {
        if (!user) {
            return res.status(404).send('Could not find a user with ID: ' + _id)
        }
        return res.status(200).send(user)
    }).catch((error) => {
        return res.status(500).send(error.message)
    })
})

app.listen(port, () => {
    console.log('Server is running on ' + port)
})