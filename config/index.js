import path from 'path'
const auth = {
    admin_secret: 'admin-token',
    tokenKey: 'Token-Auth',
    whiteList: ['login', 'client_api'],
    blackList: ['admin_api']
}
const wx = {
	wxappid: 'wx2e4f118e527bcf44',
	mch_id: '1517731521',
	wxpaykey: 'wangwenbeiwangwenbeiwangwenbei11'
}

const log = {
    logLevel: 'debug', // 指定记录的日志级别
    dir: path.resolve(__dirname, '../logs'), // 指定日志存放的目录名
    projectName: 'menu', // 项目名，记录在日志中的项目信息
    ip: '0.0.0.0' // 默认情况下服务器 ip 地址
}
const server = {
	host: '47.92.4.135',
	domain: 'https://order.wangwenbei.cn'
}

const port = '3040'

export default {
    env: process.env.NODE_ENV,
    port,
	auth,
	server,
	log,
	wx,
    mongodb: {
        username: 'wwb',
        pwd: 123456,
        address: 'localhost:27017',
        db: 'orderMenuDb'
    }
}