import db from '../../mongoDb'
let skuSchema = db.Schema({
    skuName: String,
    skuType: String,
	skuId: String
})
export default db.model('sku', skuSchema);