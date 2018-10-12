import categoryModel from '../mongoDb/models/category'
import goodModel from '../mongoDb/models/good'
import skuModel from '../mongoDb/models/sku'
import deskOrderModel from '../mongoDb/models/deskOrder'

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
	},

	async addGoodToOrder (ctx, next){

		console.log('----------------添加商品到订单 order/addGoodToOrder-----------------------')

		let paramobj = ctx.request.body;
		let {deskNo, goodId, goodName, goodCount, goodUnitPrice, goodTotalPrice, sizeSkuId, sizeSkuName, cookSkuId, cookSkuName} = paramobj;

		try {
			let data = await ctx.findOne(deskOrderModel, {deskNo: deskNo})

			if (data === null) {
				let resobj = {
					deskNo: deskNo,
					orderMony: goodTotalPrice,
					goodCount: goodCount,
					goodList: [paramobj]
				}

				await ctx.add(deskOrderModel, resobj)
			} else {
				let resobj = {deskNo: deskNo}
				resobj.orderMony = data.orderMony + goodTotalPrice
				resobj.goodCount = data.goodCount + goodTotalPrice
				resobj.goodList = data.goodList

				resobj.goodList.push(paramobj)

				await ctx.add(deskOrderModel, resobj)
			}

			ctx.send({message: '商品已加入订单'})
		} catch (error) {
			ctx.sendError(error)
		}

	},

	async getGoodDetail (ctx, next) {
		console.log('----------------获取商品详情 order/good-----------------------');
		
		let {goodId} = ctx.request.query;

		try {
			let data = await ctx.findOne(goodModel, {_id: goodId})

			let sizeSkuResArr = []
			let cookSkuResArr = []

			if (data.skuPrice) {
				for (let item of data.skuPrice) {
					let sizeskuItem = {}
					sizeskuItem.sizeSkuId = item.sizeSkuId
					let sizeSkudata = await ctx.findOne(skuModel, {_id: item.sizeSkuId})

					sizeskuItem.skuName = sizeSkudata.skuName
					sizeskuItem.price = item.price
					sizeSkuResArr.push(sizeskuItem)
				}
			}

			if (data.cookSku) {
				for (let item of data.cookSku) {
					let cookskuItem = {}
					cookskuItem.cookSkuId = item
					let cookSkudata = await ctx.findOne(skuModel, {_id: item})
					
					cookskuItem.skuName = cookSkudata.skuName
					cookSkuResArr.push(cookskuItem)
				}
			}

			let resData = JSON.parse(JSON.stringify(data))

			resData.sizeSkuList = sizeSkuResArr
			resData.cookSkuList = cookSkuResArr

			ctx.send(resData)
			
		} catch (e) {
            ctx.sendError(e)
		}
	}
}