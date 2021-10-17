const { Schema,model } = require('mongoose')

let User = new Schema({
    username: {
        type: String,
        unique: true
    },
    password: String,
    // 用户权限
    privilege: {
        type: Number,
        default: 1
    },
    // 所有网站服务需要的该用户个人数据
    services: {
        todolist: {
            categories: [String],
            items: []
        }
    }
})



module.exports = model('users', User)

