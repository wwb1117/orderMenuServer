import koaRouter from 'koa-router'
import user from '../controller/user'

const router = koaRouter()

export default app => {

/*----------------------admin-------------------------------*/
    // 用户请求
    router.get('/api/user/login', user.login)

    app.use(router.routes()).use(router.allowedMethods());
}