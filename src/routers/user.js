const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const { sendWelcomeEmail, sendCancellationEmail } = require('../emails/account')

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('File must be an image type'), undefined)
        }
        cb(undefined, true)
    }
})

router.post('/users', async ({ body }, res) => {
    const user = new User(body)

    const userExists = await User.findOne({ email: body.email })

    if (userExists) {
        return res.status(400).send('A user with email ' + body.email + ' already exists.')
    }
    try {
        await user.save()
        sendWelcomeEmail(user.name, user.email)
        const token = await user.generateJsonWebToken()
        res.status(201).send({ user, token })
    } catch (error) {
        res.status(400).send(error.message)
    }
})

router.post('/users/login', async ({ body }, res) => {
    try {
        const user = await User.findByCredentials(body.email, body.password)
        const token = await user.generateJsonWebToken()
        res.status(200).send({ user, token })
    } catch (error) {
        res.status(400).send(error.message)
    }
})

router.post('/users/logout', auth, async ({ user, token }, res) => {
    try {
        user.tokens = user.tokens.filter((authToken) => {
            return authToken.token !== token
        })
        await user.save()
        res.status(200).send('Logged out of ' + user.email)
    } catch (error) {
        res.status(404).send(error)
    }
})

router.post('/users/logoutAllSessions', auth, async ({ user }, res) => {
    try {
        user.tokens = []
        await user.save()
        res.status(200).send('Logged out of all of ' + user.email + ' sessions')
    } catch (error) {
        res.status(404).send(error)
    }
})

router.get('/users/me', auth, async (req, res) => {
    res.status(200).send(req.user)

})


router.patch('/users/me', auth, async ({ user, body }, res) => {
    const allowedUpdates = ['name', 'email', 'age', 'password']
    const requestedUpdate = Object.keys(body)
    const isValidUpdate = requestedUpdate.every((update) => {
        return allowedUpdates.includes(update)
    })

    if (!isValidUpdate) {
        return res.status(400).send({ error: 'You are attempting to update a field that does not exist, or is not allowed to be updated. You may only update ' + allowedUpdates })
    }
    try {
        requestedUpdate.forEach((update) => user[update] = body[update])

        await user.save()

        res.status(200).send(user)
    } catch (error) {
        res.status(400).send(error.message)
    }
})

router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        sendCancellationEmail(req.user.email, req.user.name)
        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async ({ file, user }, res) => {
    const buffer = await sharp(file.buffer).resize({ width: 320, height: 400 }).png().toBuffer()
    user.avatar = buffer
    await user.save()
    res.status(200).send('Avatar uploaded for ' + user.email)
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

router.delete('/users/me/avatar', auth, async ({ user }, res) => {
    if (!user.avatar) {
        return res.status(400).send('No avatar found for user.')
    }
    user.avatar = undefined
    await user.save()
    res.status(200).send('Avatar for ' + user.email + ' has been deleted')
})


router.get('/users/:id/avatar', async ({ params }, res) => {
    try {
        const user = await User.findById(params.id)

        if (!user || !user.avatar) {
            throw new Error('Problem fetching image for that user.')
        }
        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (error) {
        res.status(404).send('No image for that user')
    }
})





module.exports = router