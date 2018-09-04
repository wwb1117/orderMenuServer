import koaRouter from 'koa-router'
import user from '../controller/user'

const router = koaRouter()

export default app => {

/*----------------------admin-------------------------------*/
    // 用户请求
    router.post('/api/user/login', user.login)
    router.get('/api/user/info', user.info)
    router.get('/api/user/list', user.list)
    router.post('/api/user/add', user.add)
    router.post('/api/user/update', user.update)
    router.get('/api/user/del', user.del)


    app.use(router.routes()).use(router.allowedMethods());
}