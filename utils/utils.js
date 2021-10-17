
// (允许5-16字节，允许字母数字下划线@.)
function testUsername(username) {
    return /^[a-zA-Z0-9_@.]{4,15}$/.test(username)
}

// (必须包含大小写字母和数字的组合，可以使用特殊字符，长度在8-16之间)
function testPassword(password) {
    return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,16}$/.test(password)
}

const jwt = require('jsonwebtoken')
const SIGN_KEY = 'one apple a day keep doctors away';

function getToken(payload){
    return jwt.sign(payload,SIGN_KEY,{expiresIn: '7d'})
}

function verifyToken(token){
    return jwt.verify(token, SIGN_KEY)
}



module.exports = { testUsername,testPassword,getToken,verifyToken }
