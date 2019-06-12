
import ip from 'ip'
import conf from '../config'
import WechatAppletPay from './pay'
export default {
	async getAccessToken(ctx, next){
		try {
			let data = await  ctx.getAccessToken()

			ctx.send({
				accessToken: JSON.parse(data).access_token
			})
		} catch (error) {
			ctx.throw(error);
            ctx.sendError(error)
		}
		
	},
	async getWXuserInfo(ctx, next){
		console.log('----------------小程序用户信息 order/getUserInfo-----------------------');
		try {
			let {code} = ctx.request.query
			let data = await  ctx.wx_getUserInfo(code)

			ctx.send({
				userInfo: data
			})
		} catch (error) {
			ctx.throw(error);
            ctx.sendError(error)
		}
		
	},
	async toWxPay(ctx, next){
		console.log('----------------小程序微信支付 order/pay-----------------------');
		try {
			let paramData = ctx.request.body;

			let WechatAppletPay= new WechatAppletPay(paramData.userInfo)

			WechatAppletPay.getBrandWCPayParams(paramData.orderInfo, function (data) {
				console.log(data);
			})
		} catch (error) {
			ctx.throw(error);
            ctx.sendError(error)
		}
		
	},
	async payResNotify(ctx, next){
		console.log('----------------小程序微信支付结果通知 /api/order/payResNotify-----------------------');
		try {
			let paramData = ctx.request.query

			ctx.send({
				data: paramData
			})
		} catch (error) {
			ctx.throw(error);
            ctx.sendError(error)
		}
		
	},
	async getWXACode(ctx, next){
		try {
			let { deskNum } = ctx.request.query
			if (deskNum) {
				deskNum = Number(deskNum)
			} else {
				ctx.sendError("数量不正确!")
			}

			var dataArr = []
			let token = await ctx.getAccessToken()

			for (var i = 0; i < deskNum; i++) {
				let index = i+1
				await  ctx.wx_getWXACode(token, index)

				dataArr.push({index: i+1, codeUrl: `http://${ip.address()}:${conf.port}/code/imgcode${index}.jpg`})
			}

			ctx.send({
				imgArr: dataArr
			})
			
		} catch (error) {
			ctx.throw(error);
            ctx.sendError(error)
		}
		
	}
}