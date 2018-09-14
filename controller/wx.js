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
				let itemdata = await  ctx.wx_getWXACode(token, i+1)
				dataArr.push({index: i+1, codeData: itemdata})
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