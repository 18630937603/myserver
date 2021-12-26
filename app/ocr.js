const {getOCRResult} = require('../api')

module.exports = function (router) {
    router.post('/relicRating/ocr', async ctx => {
        await getOCRResult(ctx.request.body.picture + '').then(result => {
            console.log('ocr识别成功')
            ctx.body = {
                err: 0,
                msg: '请求成功',
                data: result
            }
        }).catch(err => {
            console.log('ocr识别失败')
            ctx.body = {
                err: 1,
                msg: '请求失败',
            }
        })
    })
}
