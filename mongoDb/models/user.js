import db from '../../mongoDb'
let userSchema = db.Schema({
    username: String,
    pwd: String
   
})
export default db.model('user', userSchema);