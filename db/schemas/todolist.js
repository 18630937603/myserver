const { Schema,model } = require('mongoose')

let Todolist = new Schema({
    owner_name: {
        type: String,
        unique: true
    },
    categories: [String],
    items: [],
})

module.exports = model('todolists', Todolist)


// items: [{
//     content: String,
//     create_time: Date,
//     deadline: Date,
//     categories: [String],
// }],