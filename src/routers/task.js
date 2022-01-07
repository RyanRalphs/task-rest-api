const express = require('express')
const router = new express.Router()
const Task = require('../models/task')

router.post('/tasks', async ({ body }, res) => {
    const task = new Task(body)

    try {
        await task.save()
        res.status(201).send({ success: 'New Task saved with name ' + task.name })
    } catch (error) {
        res.status(400).send(error.message)
    }
})


router.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find({})
        res.status(200).send(tasks)
    } catch (error) {
        res.status(500).send()
    }

})


router.get('/tasks/:id', async ({ params }, res) => {
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

router.patch('/tasks/:id', async ({ params, body }, res) => {
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

        if (!task) {
            return res.status(404).send({ error: 'Could not find a task with ID: ' + _id })
        }

        requestedUpdate.forEach((update) => task[update] = body[update])
        await task.save()

        res.status(200).send(task)
    } catch (error) {
        res.status(500).send(error.message)
    }
})

router.delete('/tasks/:id', async ({ params }, res) => {
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

module.exports = router