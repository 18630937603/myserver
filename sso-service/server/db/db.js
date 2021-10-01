const mongoose = require('mongoose')

// mongoose.connect('mongodb://username:password@localhost/sso-test')
mongoose.connect('mongodb://localhost/sso-test')

let db = mongoose.connection
db.on('err', () => {
    console.log('数据库连接失败')
})
db.on('open', () => {
    console.log('数据库连接成功')
})
