import koaRouter from 'koa-router'
import user from '../controller/user'
import wx from '../controller/wx'

const router = koaRouter()

export default app => {

/*----------------------admin-------------------------------*/
    // 用户请求
	router.post('/api/user/login', user.login)
	//微信获取accesstoken
	router.get('/api/get/wx/accesstoken', wx.getAccessToken)
	router.get('/api/get/wx/getWXACode', wx.getWXACode)

    app.use(router.routes()).use(router.allowedMethods());
}