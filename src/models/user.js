
const mongoose = require('mongoose')
const validator = require('validator')

const User = mongoose.model('User', {
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error(value + ' is not a valid email')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if(!value < 0) {
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
            if(value.toLowerCase().includes('password')) {
                throw new Error('Password must be greater than 6 characters and not contain the word "password"')
            }
        }
    }
})

module.exports = User