import Koa from 'koa'
// import ip from 'ip'
const https = require('https')
const fs = require('fs')
const enforceHttps = require('koa-sslify')
// import conf from './config'
import router from './router'
import middleware from './middleware'
import './mongodb'

const app = new Koa()

middleware(app)
router(app)

var options = {
    key: fs.readFileSync('./ssl/server.key'),  //ssl文件路径
    cert: fs.readFileSync('./ssl/server.pem')  //ssl文件路径
}

app.use(enforceHttps());
https.createServer(options, app.callback()).listen(3000);
app.on('error', function(err,ctx){
    console.log(err);
});
// app.listen(conf.port, '0.0.0.0', () => {
//     console.log(`server is running at http://${ip.address()}:${conf.port}`)
// })
