const Router = require('koa-router')
const router = new Router();

const User = require('../db/schemas/user')

router.post('/login', ctx => {
    let user = new User({
        username: 'lzh',
        password: '123456'
    });
    user.save()
    ctx.body = '登录成功'
})
router.post('/logout',async ctx => {
    ctx.body = await User.find().exec()
})

module.exports = router
