import koaRouter from 'koa-router'
import user from '../controller/user'
import wx from '../controller/wx'
import cate from '../controller/category'
import sku from '../controller/sku'
import up from '../controller/upload'

const multer = require('koa-multer');

const router = koaRouter()

//图片上传配置
var storage = multer.diskStorage({
	//文件保存路径  
	destination: function(req, file, cb) {
		cb(null, 'public/images/')
	},
	//修改文件名称  
	filename: function(req, file, cb) {
		var fileFormat = (file.originalname).split(".");
		cb(null, Date.now() + "." + fileFormat[fileFormat.length - 1]);
	}
})
//加载配置  
var upload = multer({ storage: storage });
//图片上传配置


export default app => {

/*----------------------admin-------------------------------*/
    // 用户请求
	router.post('/api/user/login', user.login)
	//微信获取accesstoken
	router.get('/api/get/wx/accesstoken', wx.getAccessToken)
	router.get('/api/get/wx/getWXACode', wx.getWXACode)
	//商品类目
	router.post('/api/category/add', cate.add)
	router.get('/api/category/list', cate.getList)
	router.delete('/api/category/delete', cate.remove)
	router.put('/api/category/update', cate.update)
	//商品规格
	router.post('/api/sku/add', sku.add)
	router.get('/api/sku/list', sku.getList)
	//图片上传
	router.post('/api/f/upload', upload.single('file'), up.imgUpload)

    app.use(router.routes()).use(router.allowedMethods());
}