import db from '../../mongoDb'
let countIdSchema = db.Schema({
    fieldName: String,
	fieldId: {type: Number, default: 0}
})
export default db.model('countId', countIdSchema);