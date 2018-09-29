import db from '../../mongoDb'
let countIdSchema = db.Schema({
    fieldName: String,
	fieldId: Number
})
export default db.model('countId', countIdSchema);