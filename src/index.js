const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const bcrypt = require('bcryptjs')


const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(taskRouter, userRouter)


app.listen(port, () => {
    console.log('Server is running on ' + port)
})
