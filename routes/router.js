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

router.post('/verify',async ctx => {
    console.log('收到前端验证Token请求:',ctx.request.body)
    try{
        if(verifyToken(ctx.request.body.token)){
            console.log('token验证成功')
            ctx.body = {
                err:0,
                msg:'验证成功'
            }
        }
    }catch (e){
        console.log('前端token验证失败')
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
        let { username } = verifyToken(ctx.query.token);
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
        let { username } = verifyToken(ctx.request.body.token);
        Todolist.updateOne({owner_name:username},{items:ctx.request.body.items},(err,res)=>{
            if(err) console.log(err);
            else console.log(username,'保存',ctx.request.body.items,'成功')
        })
        ctx.body = {
            err: 0,
            msg: '保存成功！'
        }
    }catch (e){
        console.log(e)
        ctx.body = {
            err: 1,
            msg: '服务器todolist保存处理程序出错'
        }
    }
})

router.post('/changepwd',async ctx => {
    console.log('收到前端修改密码请求：',ctx.request.body);
    try{
        let { username,password,new_password } = ctx.request.body;
        let user = await User.findOne({username}).exec();
        if(user){
            if(user.password===password) {
                if(testPassword(new_password)) {
                    User.updateOne({username:username},{password:new_password},(err,res)=>{
                        if(err) console.log(err);
                        else console.log(username,'修改密码为',new_password,'成功');
                    })
                    ctx.body = {
                        err:0,
                        msg:'密码修改成功'
                    }
                }else {
                    ctx.body = {
                        err:1,
                        msg:'新密码格式不正确'
                    }
                }
            }else {
                ctx.body = {
                    err:1,
                    msg:'原密码错误'
                }
            }
        }else{
            ctx.body = {
                err:1,
                msg:'用户不存在'
            }
        }
    }catch (e) {
        console.log(e)
        ctx.body = {
            err:4,
            msg:'服务器内部错误'
        }
    }
})


module.exports = router
