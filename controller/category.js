import categoryModel from '../mongoDb/models/category'
module.exports = {
    async add (ctx, next) {
		console.log('----------------添加类目 categoryModel/add-----------------------');
		
		let paramsData = ctx.request.body;
		
        try {
			let data = await ctx.findOne(categoryModel, {categoryName: paramsData.categoryName})
			
            if (data) {
                ctx.sendError('类目名已存在, 请重新添加!')
            }else{
				let data = await ctx.add(categoryModel, {
					categoryName: paramsData.categoryName
				});
				
                ctx.send({message: '新增成功'})
            }
        }catch(e) {

			ctx.sendError(e)
			
        }
	},
	async getList(ctx, next){
		console.log('----------------获取类目列表 category/list-----------------------');
		let {pageNo = 1, pageSize = 15} = ctx.request.query

		try {
			let reg = new RegExp('', 'i')

			let data = await ctx.findPage(categoryModel, {
                $or: [
                    {categoryName: { $regex: reg}}
                ]
            }, {_id:1,categoryName:1}, {limit: pageSize*1, skip: (pageNo-1)*pageSize})

			ctx.send(data)
		} catch (e) {
            ctx.sendError(e)
		}

	},
	async remove (ctx, next) {
		console.log('----------------删除类目 category/delete-----------------------');
        let id = ctx.request.query.id
        try {
            ctx.remove(categoryModel, {_id: id})
            ctx.send({message: '删除成功'})
        }catch(e){
            ctx.sendError(e)
        }
	},
	
	async update (ctx, next) {
        console.log('----------------更新类目 category/update-----------------------');
		let paramsData = ctx.request.body;
        try {
            let data = await ctx.findOne(categoryModel, {_id: paramsData._id}) 
            
			await ctx.update(categoryModel, {_id: paramsData._id}, paramsData)
			
			ctx.send({message: '修改成功'})
			
        }catch(e) {
			ctx.sendError(e)
        }
    }


}