import categoryModel from '../mongoDb/models/category'
import goodModel from '../mongoDb/models/good'

module.exports = {
    async getMenuList (ctx, next) {
		console.log('----------------获取菜单 order/menu-----------------------');
		
        let pageNo = 1, pageSize = 1000

		try {
			let reg = new RegExp('', 'i')

			let categoryData = await ctx.findPage(categoryModel, {
                $or: [
                    {categoryName: { $regex: reg}}
                ]
			}, {_id:1,categoryName:1}, {limit: pageSize*1, skip: (pageNo-1)*pageSize})
			
			let resArr = []

			for (let item of categoryData.list) {
				let obj = {}

				let reg1 = new RegExp(item._id, 'i')

				let data = await ctx.findPage(goodModel, {
					$or: [
						{categoryId: { $regex: reg1}}
					]
				}, {}, {limit: 1000*1, skip: (1-1)*pageSize})

				obj.goodsList = data.list
				obj.categoryName = item.categoryName
				obj.categoryId = item._id

				resArr.push(obj)

			}

			ctx.send(resArr)
		} catch (e) {
            ctx.sendError(e)
		}
	}
}