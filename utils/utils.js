const jwt = require('jsonwebtoken')

// (允许5-16字节，允许字母数字下划线@.)
function testUsername(username) {
    return /^[a-zA-Z0-9_@.]{4,15}$/.test(username)
}

// (必须包含大小写字母和数字的组合，可以使用特殊字符，长度在8-16之间)
function testPassword(password) {
    return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,16}$/.test(password)
}

function getToken(payload) {
    return jwt.sign(payload, globalConfig.JWT_SIGN_KEY, {expiresIn: '7d'})
}

function verifyToken(token) {
    return jwt.verify(token, globalConfig.JWT_SIGN_KEY)
}

function removeBase64Prefix(base64) {
    const matchRes = base64.match(new RegExp("^data:image/.*;base64,"))
    if (matchRes) {
        return base64.slice(matchRes[0].length)
    } else {
        return base64
    }
}


module.exports = {testUsername, testPassword, getToken, verifyToken, removeBase64Prefix}
