const {verifyToken} = require("../utils/utils")
const User = require('../db/schemas/user')
const wsrouter = require('koa-router')()

// 存储正在进行ws连接的连接信息
// todo:增加定时清理死连接逻辑
let aliveConnections = []

wsrouter.all('/socket/todolist', async ctx => {
    // 获取前端query
    const session = ctx.query.session
    const username = verifyToken(ctx.query.token).username
    // 读数据库
    let user = await User.findOne({username}).exec()

    // 绑定处理消息事件
    ctx.websocket.on('message', message => {
        let todo_items = JSON.parse(message)
        // 将前端发送的数据存数据库
        User.updateOne({username}, {"services.todolist.items": todo_items}, {}, (error, res) => {
            if (error) console.log(error)
        })
        // 给非当前连接的此用户连接发送数据
        aliveConnections.forEach(item => {
            if (item.username === username && item.session !== session) {
                item.ctx.websocket.send(JSON.stringify({
                    status_code: 0,
                    data: todo_items
                }))
            }
        })
        // 给前端返回消息
        ctx.websocket.send(JSON.stringify({
            status_code: 1,
            msg: "保存成功！"
        }))
    })
    // 绑定处理关闭事件
    ctx.websocket.on('close', () => {
        aliveConnections = aliveConnections.filter(item => item.session !== session)
        console.log(session, "ws连接关闭了,剩余ws连接数：", aliveConnections.length)
    })

    // 初始化连接
    ctx.websocket.send(JSON.stringify({
        status_code: 0,
        data: user.services.todolist.items
    }));
    aliveConnections.push({username, session, ctx})
    console.log(`[${Date.now().toLocaleString('zh-CN')}]`, session, "ws连接建立了，用户：", username, '目前连接数：', aliveConnections.length)
})


module.exports = wsrouter
