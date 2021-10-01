const Koa = require('koa');
const app = new Koa();
const db = require('./db/db')
const router = require('./routes/router')

const PORT = 3000


// app.use(ctx => {
//     console.log('客户端请求服务器了')
//     ctx.body = "你好，我是服务器"
// })

app.use(router.routes())
app.use(router.allowedMethods())

app.listen(PORT,()=>{
    console.log(`服务器已启动，监听端口${PORT}`)
})
