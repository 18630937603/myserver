const mongoose = require('mongoose')

// schema:mongoose.connect('mongodb://username:password@localhost/database')
mongoose.connect(globalConfig.DATABASE_URI)

let db = mongoose.connection
db.on('err', () => {
    console.log('数据库连接失败')
})
db.on('open', () => {
    console.log('数据库连接成功')
})
