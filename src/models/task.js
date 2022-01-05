const mongoose = require('mongoose')

const Task = mongoose.model('Task', {
    name: {
        type: String
    },
    description: {
        type: String,
        trim: true,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    }
})

module.exports = Task