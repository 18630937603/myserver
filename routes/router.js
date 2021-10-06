const Router = require('koa-router')
const router = new Router();
const User = require('../db/schemas/user')
const Todolist = require('../db/schemas/todolist')
const { testUsername,testPassword,getToken,verifyToken } = require('../utils/utils')

router.post('/login', async ctx => {
    console.log('收到前端登录请求:',ctx.request.body)
    try{
        let { username,password } = ctx.request.body
        if(!testUsername(username) || !testPassword(password)){
            ctx.body = {
                err:1,
                msg:'用户名或密码格式错误',
            }
            return
        }
        let user = await User.findOne({username}).exec()
        if(user){
            if(user.password===password){
                ctx.body = {
                    err:0,
                    msg:'登录成功',
                    // 签发token
                    token: getToken({
                        username: username,
                        privilege: user.privilege
                    })
                }
            }else{
                ctx.body = {
                    err:2,
                    msg:'密码错误',
                }
            }
        }else{
            ctx.body = {
                err:3,
                msg:'用户不存在',
            }
        }
    }catch (err){
        console.log(err)
        ctx.body = {
            err:4,
            msg:'服务器登录程序出错',
        }
    }
})

router.post('/verify',ctx => {
    console.log('收到前端验证Token请求:',ctx.request.body)
    if(verifyToken(ctx.request.body.token)){
        ctx.body = {
            err:0,
            msg:'验证成功'
        }
    }else{
        ctx.body = {
            err:1,
            msg:'验证失败'
        }
    }
})

router.post('/register',async ctx => {
    console.log('收到前端注册请求:',ctx.request.body)
    try{
        let { username,password } = ctx.request.body
        if(!testUsername(username) || !testPassword(password)){
            ctx.body = {
                err:1,
                msg:'用户名或密码格式错误',
            }
            return
        }
        if(await User.findOne({username}).exec()) {
            ctx.body = {
                err:1,
                msg:'该用户已注册'
            }
            return
        }
        let user = new User({
            username,
            password
        });
        await user.save((err,res)=>{
            if(err) console.log(err)
        })
        ctx.body = {
            err:0,
            msg:'注册成功',
        }
    }catch (err){
        console.log(err)
        ctx.body = {
            err:1,
            msg:'服务器注册程序出错',
        }
    }
})

router.get('/todolist',async ctx => {
    try {
        let { username,privilege } = verifyToken(ctx.query.token);
        // 控制服务访问权限
        if(privilege>=1){
            let todo = await Todolist.findOne({owner_name:username}).exec();
            // 如果该用户从未使用过todolist服务，则为他在todolist collection中创建一个专属的todolist document
            if(!todo) {
                let todolist = new Todolist({
                    owner_name: username,
                    categories: [],
                    items: []
                })
                await todolist.save();
                ctx.body = {
                    err: 0,
                    msg: '创建todolist服务成功',
                    todolist: todolist
                }
            }else{
                ctx.body = {
                    err: 0,
                    msg: '找到服务器中的todolist',
                    todolist: todo
                }
            }
        }else{
            ctx.body = {
                err: 1,
                msg: '抱歉，您没有权限使用该服务'
            }
        }
    }catch (e){
        console.log(e)
        ctx.body = {
            err: 1,
            msg: '服务器待办事项处理程序出错'
        }
    }
})

router.post('/save',async ctx => {
    try {
        let { username,privilege } = verifyToken(ctx.request.body.token);
        // 控制服务访问权限
        if(privilege>=1){
            Todolist.updateOne({owner_name:username},{items:ctx.request.body.items},(err,res)=>{
                if(err) console.log(err);
                else console.log(username,'保存',ctx.request.body.items,'成功')
            })
            ctx.body = {
                err: 0,
                msg: '保存成功！'
            }
        }else{
            ctx.body = {
                err: 1,
                msg: '抱歉，您没有权限使用该服务'
            }
        }
    }catch (e){
        console.log(e)
        ctx.body = {
            err: 1,
            msg: '服务器todolist保存处理程序出错'
        }
    }
})

module.exports = router
