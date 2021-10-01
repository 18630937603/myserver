const { Schema,model } = require('mongoose')

let User = new Schema({
    username: String,
    password: String
})

module.exports = model('users', User)

