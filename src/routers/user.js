const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const auth = require('../middleware/auth')

router.post('/users', async ({ body }, res) => {
    const user = new User(body)

    const userExists = await User.findOne({email: body.email})

    if(userExists) {
        return res.status(400).send('A user with email ' + body.email + ' already exists.')
    }
    try {
        await user.save()
        const token = await user.generateJsonWebToken()
        res.status(201).send({user, token})
    } catch (error) {
        res.status(400).send(error.message)
    }
})

router.post('/users/login', async ({ body }, res) => {
    try {
        const user = await User.findByCredentials(body.email, body.password)
        const token = await user.generateJsonWebToken()
        res.status(200).send({user, token})
    } catch (error) {
        res.status(400).send(error.message)
    }
})

router.get('/users/me', auth, async (req, res) => {
    res.status(200).send(req.user)
})


router.get('/users/:id', async ({ params }, res) => {
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

router.patch('/users/:id', async ({ params, body }, res) => {
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
        const user = await User.findById(_id)

        if (!user) {
            return res.status(404).send({ error: 'Could not find a user with ID: ' + _id })
        }

        requestedUpdate.forEach((update) => user[update] = body[update])

        await user.save()

        res.status(200).send(user)
    } catch (error) {
        res.status(500).send(error.message)
    }
})

router.delete('/users/:id', async ({ params }, res) => {
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






module.exports = router