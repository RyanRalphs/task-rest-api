
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const validator = require('validator')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error(value + ' is not a valid email')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (!value < 0) {
                throw new Error(value + 'doesnt seem to be a age.')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password must be greater than 6 characters and not contain the word "password"')
            }
        }
    }
})

userSchema.statics.findByCredentials = async (email, password) => {
        const user = await User.findOne({email})
        if(!user) {
            throw new Error('Cannot find user with email of ' + email)
        }

        const matchPasswords = await bcrypt.compare(password, user.password)
        if(!matchPasswords) {
            throw new Error('Incorrect credentials - Please try again')
        }

        return user 
}

// Hashing a plain text password pre-save
userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User