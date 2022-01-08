const express = require('express')
const router = new express.Router()
const Task = require('../models/task')
const auth = require('../middleware/auth')

router.post('/tasks', auth, async ({ user, body }, res) => {
    const task = new Task(body)


    try {
        task.user_id = user._id
        await task.save()
        res.status(201).send({ success: 'New Task saved with name ' + task.name })
    } catch (error) {
        res.status(400).send(error.message)
    }
})


router.get('/tasks', auth, async ({ user }, res) => {
    try {
        const tasks = await Task.find({ user_id: user._id })
        res.status(200).send(tasks)
    } catch (error) {
        res.status(500).send()
    }

})


router.get('/tasks/:id', auth, async ({ params, user }, res) => {
    const _id = params.id

    try {
        const task = await Task.findById(_id)

        if (!task || task.user_id !== user.toJSON()._id) {
            return res.status(404).send({ error: 'Could not find your task with ID: ' + _id })
        }
        res.status(200).send(task)
    } catch (error) {
        res.status(500).send(error.message)
    }
})

router.patch('/tasks/:id', auth, async ({ params, body, user }, res) => {
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
        const task = await Task.findById(_id)

        if (!task || task.user_id !== user.toJSON()._id) {
            return res.status(404).send({ error: 'Could not find a task with ID: ' + _id })
        }

        requestedUpdate.forEach((update) => task[update] = body[update])
        await task.save()

        res.status(200).send(task)
    } catch (error) {
        res.status(500).send(error.message)
    }
})

router.delete('/tasks/:id', auth, async ({ params, user }, res) => {
    const _id = params.id

    try {
        const task = await Task.findById(_id)
        if (!task || task.user_id !== user.toJSON()._id) {
            return res.status(404).send({ error: 'Could not find a task with ID: ' + _id })
        }
        await task.delete()
        res.status(200).send(task)
    } catch (error) {
        res.status(500).send(error.message)
    }
})

module.exports = router