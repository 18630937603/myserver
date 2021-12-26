const createRouter = require('koa-router')
const router = createRouter()
const wsRouter = createRouter()

const useAuth = require('../app/auth')
const useTodolist = require('../app/todolist')
const useOcr = require('../app/ocr')


useAuth(router)
useTodolist(wsRouter)
useOcr(router)


module.exports = {router,wsRouter}

