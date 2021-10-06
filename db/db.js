const mongoose = require('mongoose')

// mongoose.connect('mongodb://username:password@localhost/database')
mongoose.connect('mongodb://localhost/lzh')

let db = mongoose.connection
db.on('err', () => {
    console.log('数据库连接失败')
})
db.on('open', () => {
    console.log('数据库连接成功')
})
