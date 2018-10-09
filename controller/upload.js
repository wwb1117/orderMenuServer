import ip from 'ip'
import conf from '../config'


export default {
	async imgUpload(ctx, next){
		var imgname = ctx.req.file.filename

		ctx.send({url: `http://${ip.address()}:${conf.port}/images/${imgname}`})
	}
}