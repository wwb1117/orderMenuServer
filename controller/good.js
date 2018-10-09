import goodModel from '../mongoDb/models/good'
module.exports = {
    async add (ctx, next) {
		console.log('----------------添加商品 good/add-----------------------');
		
		let paramsData = ctx.request.body;

		console.log(paramsData)
		
        try {
			let data = await ctx.add(goodModel, paramsData);
			
			ctx.send({message: '新增成功'})
            
        }catch(e) {
			ctx.sendError(e)
        }
	},
	async getList(ctx, next){
		console.log('----------------获取商品列表 good/list-----------------------');
		let {goodName, pageNo = 1, pageSize = 15} = ctx.request.query

		try {
			let reg1 = new RegExp(goodName, 'i')

			let data = await ctx.findPage(goodModel, {
                $or: [
                    {goodName: { $regex: reg1}}
                ]
            }, {}, {limit: pageSize*1, skip: (pageNo-1)*pageSize})

			ctx.send(data)
		} catch (e) {
            ctx.sendError(e)
		}

	},
	async remove (ctx, next) {
		console.log('----------------删除商品 good/delete-----------------------');
		let id = ctx.request.query.id
		
        try {
            ctx.remove(goodModel, {_id: id})
            ctx.send({message: '删除成功'})
        }catch(e){
            ctx.sendError(e)
        }
	},
	
	async update (ctx, next) {
        console.log('----------------更新商品 good/update-----------------------');
		let paramsData = ctx.request.body;
        try {
            let data = await ctx.findOne(goodModel, {_id: paramsData._id}) 
            
			await ctx.update(goodModel, {_id: paramsData._id}, paramsData)
			
			ctx.send({message: '修改成功'})
			
        }catch(e) {
			ctx.sendError(e)
        }
    }


}