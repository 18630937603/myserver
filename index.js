const Koa = require('koa');
const app = new Koa();
const db = require('./db/db')
const router = require('./routes/router')
const koaCors = require('koa2-cors')
const koaBodyParser = require('koa-bodyparser')

const PORT = 8081

app.use(koaCors())
app.use(koaBodyParser()) // 这个得在router前面
app.use(router.routes())
app.use(router.allowedMethods())


app.listen(PORT,()=>{
    console.log(`服务器已启动，监听端口${PORT}`)
})
