import categoryModel from '../mongoDb/models/category'
import goodModel from '../mongoDb/models/good'
import skuModel from '../mongoDb/models/sku'
import deskOrderModel from '../mongoDb/models/deskOrder'
import * as math from 'mathjs'

math.config({
	number: 'BigNumber',
	precision: 20
})

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
	async getShopList (ctx, next){
		console.log('----------------获取购物车商品列表 order/getShopList-----------------------')
		let {deskNo} = ctx.request.query

		try {
			let data = await ctx.findOne(deskOrderModel, {deskNo: deskNo})
			ctx.send(data)
		} catch (error) {
			ctx.sendError(error)
		}


	},
	async searchGood (ctx, next){
		console.log('----------------搜索商品 order/search/good-----------------------')

		let {goodName} = ctx.request.query

		try {
			let reg1 = new RegExp(goodName, 'i')

			let data = await ctx.findPage(goodModel, {
                $or: [
                    {goodName: { $regex: reg1}}
                ]
            }, {}, {limit: 10, skip: 0})

			ctx.send(data)
		} catch (e) {
            ctx.sendError(e)
		}

	},
	async shopListChange(ctx, next){
		console.log('----------------购物车商品增减 order/shopListChange-----------------------')
		let paramobj = ctx.request.body;
		let {deskNo, goodId, goodCount, index} = paramobj

		try {
			let data = await ctx.findOne(deskOrderModel, {deskNo: deskNo})
			let newData = JSON.parse(JSON.stringify(data))
			let goodlist = JSON.parse(JSON.stringify(newData.goodList))

			let currentIndex = index
			let currentobj = JSON.parse(JSON.stringify(goodlist[currentIndex]))

			if (goodCount == 0) {
				// newData.orderMoney = newData.orderMoney - goodlist[currentIndex].goodTotalPrice
				newData.orderMoney = math.eval(`${newData.orderMoney} - ${goodlist[currentIndex].goodTotalPrice}`)

				// newData.goodCount = newData.goodCount - goodlist[currentIndex].goodCount
				newData.goodCount = math.eval(`${newData.goodCount} - ${goodlist[currentIndex].goodCount}`)
				goodlist.splice(currentIndex, 1)
			} else {
				// newData.orderMoney = newData.orderMoney - goodlist[currentIndex].goodTotalPrice
				// newData.goodCount = newData.goodCount + (goodCount - goodlist[currentIndex].goodCount)
				//先从订单里面把这条商品的所有价钱都删掉,重新添加

				newData.orderMoney = math.eval(`${newData.orderMoney} - ${goodlist[currentIndex].goodTotalPrice}`)

				newData.goodCount = math.eval(`${newData.goodCount} + (${goodCount} - ${goodlist[currentIndex].goodCount})`)
				
				goodlist[currentIndex] = null
				currentobj.goodCount = goodCount

				// currentobj.goodTotalPrice = goodCount * currentobj.goodUnitPrice
				// newData.orderMoney = newData.orderMoney + currentobj.goodTotalPrice

				currentobj.goodTotalPrice = math.eval(`${goodCount} * ${currentobj.goodUnitPrice}`)

				//订单重新添加商品的价格

				newData.orderMoney = math.eval(`${newData.orderMoney} + ${currentobj.goodTotalPrice}`)
				goodlist[currentIndex] = currentobj

			}

			newData.goodList = goodlist

			await ctx.update(deskOrderModel, {deskNo: deskNo}, newData)

			ctx.send({message: '修改成功'})
			
		} catch (error) {
			ctx.sendError(error)
		}
	},
	async addGoodToOrder (ctx, next){

		console.log('----------------添加商品到订单 order/addGoodToOrder-----------------------')

		let paramobj = ctx.request.body;
		let {deskNo, goodId, goodName, goodCount, goodUnitPrice, goodTotalPrice, sizeSkuId, sizeSkuName, cookSkuId, cookSkuName} = paramobj;

		paramobj.goodUnitPrice = Number(paramobj.goodUnitPrice)
		paramobj.goodTotalPrice = Number(paramobj.goodTotalPrice)
		paramobj.goodCount = Number(paramobj.goodCount)

		try {
			let data = await ctx.findOne(deskOrderModel, {deskNo: deskNo})

			if (data === null) {
				let resobj = {
					deskNo: deskNo,
					orderMoney: Number(goodTotalPrice),
					goodCount: Number(goodCount),
					goodList: [paramobj]
				}

				await ctx.add(deskOrderModel, resobj)
			} else {
				let resobj = {deskNo: deskNo}
				// resobj.orderMoney = Number(data.orderMoney) + Number(goodTotalPrice)
				resobj.orderMoney = math.eval(`${data.orderMoney} + ${goodTotalPrice}`)
				// resobj.goodCount = Number(data.goodCount) + Number(goodCount)
				resobj.goodCount = math.eval(`${data.goodCount} + ${goodCount}`)
				resobj.goodList = data.goodList

				resobj.goodList.push(paramobj)

				await ctx.update(deskOrderModel, {deskNo: deskNo}, resobj)
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