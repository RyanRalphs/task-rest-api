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

const main = async () => {
    // const task = await Task.findById('61da231d0e9f7d2f4bab0e15')
    //  await task.populate('owner')
    // console.log(task.owner)

    const user = await User.findById('61da24b172effff207d016b9')
    await user.populate('tasks') 
    console.log(user.tasks)
}

main()