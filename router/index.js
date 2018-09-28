import koaRouter from 'koa-router'
import user from '../controller/user'
import wx from '../controller/wx'
import cate from '../controller/category'

const router = koaRouter()

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

    app.use(router.routes()).use(router.allowedMethods());
}