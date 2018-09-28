import db from '../../mongoDb'
let categorySchema = db.Schema({
    categoryName: String,
	categoryId: String
})
export default db.model('category', categorySchema);