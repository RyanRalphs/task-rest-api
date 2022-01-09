const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT || 3000


app.use(express.json())
app.use(taskRouter, userRouter)


app.listen(port, () => {
    console.log('Server is running on ' + port)
})



const Task = require('./models/task')
const User = require('./models/user')

