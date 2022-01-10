const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const multer = require('multer')

const app = express()


app.use(express.json())
app.use(taskRouter, userRouter)

module.exports = app

