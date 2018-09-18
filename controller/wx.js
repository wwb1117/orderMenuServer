
import ip from 'ip'
import conf from '../config'
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