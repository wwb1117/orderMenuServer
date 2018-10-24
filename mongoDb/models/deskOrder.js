import db from '../../mongoDb'
let deskOrderSchema = db.Schema({
	deskNo: Number,
	remark: {type: String, default: ''},
	orderMoney: {type: Number, default: 0},
    goodCount: {type: Number, default: 0},
	goodList: {type: Array, default: []}
	// payTime: {type: Date, default: Date.now}
})
export default db.model('deskOrder', deskOrderSchema);