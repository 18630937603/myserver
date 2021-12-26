require('../globalConfig')
const Koa = require('koa')
const enableWebsocket = require('koa-websocket')
const koaCors = require('koa2-cors')
const koaBodyParser = require('koa-bodyparser')
require('./db')
const {router, wsRouter} = require('./router')

const app = enableWebsocket(new Koa())

app.use(koaCors())
    .use(koaBodyParser()) // 这个得在router前面
    .use(router.routes())
    .use(router.allowedMethods())
    .use(wsRouter.routes())
    .use(wsRouter.allowedMethods())

app.listen(globalConfig.PORT, () => {
    console.log(`服务器已启动，监听端口${globalConfig.PORT}`)
})


