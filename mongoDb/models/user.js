import db from '../../mongoDb'
let userSchema = db.Schema({
    username: String,
	pwd: String,
	logintime: String
})
export default db.model('user', userSchema);