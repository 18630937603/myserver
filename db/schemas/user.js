const { Schema,model } = require('mongoose')

let User = new Schema({
    username: {
        type: String,
        unique: true
    },
    password: String,
    privilege: {
        type: Number,
        default: 1
    }
})

module.exports = model('users', User)

