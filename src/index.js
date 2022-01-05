const express = require('express')
require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

app.post('/users', ({body}, res) => { 
    const newUser = new User(body)  

    newUser.save().then((user) => {
        return res.send('New User saved with name ' + user.name, 201)
    }).catch((error) => {
        return res.send(error.message, 400)
    })
})


app.post('/tasks', ({body}, res) => {
    const newTask = new Task(body)

    newTask.save().then((task) => {
        return res.send('New Task saved with name ' + task.name, 201)
    }).catch((error) => {
        return res.send(error.message, 400)
    })
})

app.listen(port, () => {
     console.log('Server is running on ' + port)
})