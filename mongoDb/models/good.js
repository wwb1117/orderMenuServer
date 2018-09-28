import db from '../../mongoDb'
let goodSchema = db.Schema({
    categoryName: String,
	categoryId: String,
	goodsName: String,
	goodsId: String,
	lowPrice: String,
	img: String,
	sizeSku: Array,
	cookSku: Array
})
export default db.model('good', goodSchema);