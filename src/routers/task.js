const express = require('express')
const router = new express.Router()
const Task = require('../models/task')
const auth = require('../middleware/auth')

router.post('/tasks', auth, async ({ user, body }, res) => {
    const task = new Task({
        ...body,
        owner: user._id
    })
    try {
        await task.save()
        res.status(201).send({_id: task._id})
    } catch (error) {
        res.status(400).send(error.message)
    }
})


router.get('/tasks', auth, async ({ user, query }, res) => {

    const match = {}
    const sort = {}
    if (query.completed) {
        match.completed = query.completed === 'true'
    }

    if (query.sort) {
        const parts = query.sort.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try {
        await user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(query.limit),
                skip: parseInt(query.skip),
                sort
            }
        })
        res.status(200).send(user.tasks)
    } catch (error) {
        console.log(error)
        res.status(500).send()
    }

})


router.get('/tasks/:id', auth, async ({ params, user }, res) => {
    const _id = params.id



    try {
        const task = await Task.findOne({ _id, owner: user._id })
        if (!task) {
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
        const task = await Task.findOne({ _id, owner: user._id })

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

router.delete('/tasks/:id', auth, async ({ params, user }, res) => {
    const _id = params.id

    try {
        const task = await Task.findOneAndDelete({ _id, owner: user._id })
        if (!task) {
            return res.status(404).send({ error: 'Could not find a task with ID: ' + _id })
        }
        res.status(200).send(task)
    } catch (error) {
        res.status(500).send(error.message)
    }
})

module.exports = router