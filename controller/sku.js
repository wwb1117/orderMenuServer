import skuModel from '../mongoDb/models/sku'
import countModel from '../mongoDb/models/countId'
module.exports = {
    async add (ctx, next) {
		console.log('----------------添加规格 sku/add-----------------------');
		
		let paramsData = ctx.request.body;
		
        try {
			let data = await ctx.findOne(skuModel, {skuName: paramsData.skuName})

			let countData = await ctx.findOne(countModel, {fieldName: 'skuModel'})
			let countId = 0

			if (countId) {
				countId = countData.fieldId
			}

			console.log(countId)
			
            if (data) {
                ctx.sendError('规格名已存在, 请重新添加!')
            }else{
				let data = await ctx.add(skuModel, {
					skuName: paramsData.skuName,
					skuType: paramsData.skuType
				});
				
                ctx.send({message: '新增成功'})
            }
        }catch(e) {

			ctx.sendError(e)
			
        }
	},
	async getList(ctx, next){
		console.log('----------------获取规格列表 sku/list-----------------------');
		let {skuName, skuType, pageNo = 1, pageSize = 15} = ctx.request.query

		try {
			let reg1 = new RegExp(skuName, 'i')
			let reg2 = new RegExp(skuType, 'i')

			let data = await ctx.findPage(skuModel, {
                $and: [
                    {skuName: { $regex: reg1}},
                    {skuType: { $regex: reg2}}
                ]
            }, {_id:1, skuName:1, skuType: 1}, {limit: pageSize*1, skip: (pageNo-1)*pageSize})

			ctx.send(data)
		} catch (e) {
            ctx.sendError(e)
		}

	},
	async remove (ctx, next) {
		console.log('----------------删除规格 sku/delete-----------------------');
		let id = ctx.request.query.id
		
        try {
            ctx.remove(skuModel, {_id: id})
            ctx.send({message: '删除成功'})
        }catch(e){
            ctx.sendError(e)
        }
	},
	
	async update (ctx, next) {
        console.log('----------------更新规格 sku/update-----------------------');
		let paramsData = ctx.request.body;
        try {
            let data = await ctx.findOne(skuModel, {_id: paramsData._id}) 
            
			await ctx.update(skuModel, {_id: paramsData._id}, paramsData)
			
			ctx.send({message: '修改成功'})
			
        }catch(e) {
			ctx.sendError(e)
        }
    }


}