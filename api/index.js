const axios = require('axios')
const {removeBase64Prefix} = require('../utils/utils')

const request = axios.create({
    headers: {
        'Content-Type': 'application/json'
    }
})

let huaweiToken = {
    value: '',
    expires: null
}

async function getToken() {
    if (huaweiToken.value && new Date() < huaweiToken.expires) return huaweiToken.value;
    return request.post('https://iam.cn-north-4.myhuaweicloud.com/v3/auth/tokens', {
        "auth": {
            "identity": {
                "methods": [
                    "password"
                ],
                "password": {
                    "user": {
                        "name": globalConfig.HUAWEI_USERNAME, //IAM用户名
                        "password": globalConfig.HUAWEI_PASSWORD, //密码
                        "domain": {
                            "name": globalConfig.HUAWEI_USERNAME //帐号名
                        }
                    }
                }
            },
            "scope": {
                "project": {
                    "name": globalConfig.HUAWEI_PROJECT_NAME //替换为实际的project name
                }
            }
        }
    }).then(response => {
        huaweiToken.value = response.headers['x-subject-token']
        huaweiToken.expires = new Date(response.data.token.expires_at)
        return response.headers['x-subject-token']
    }).catch(err => {
        console.error(err)
    })
}

async function getOCRResult(base64) {
    return getToken().then(token => {
        return request.post(`https://ocr.cn-north-4.myhuaweicloud.com/v2/${globalConfig.HUAWEI_PROJECT_ID}/ocr/general-text`, {
            "image": removeBase64Prefix(base64),
            "detect_direction": false,
            "quick_mode": false
        }, {
            headers: {
                'X-Auth-Token': token
            }
        }).then(res=>{
            return res.data.result
        })
    })
}

module.exports = {getOCRResult}
