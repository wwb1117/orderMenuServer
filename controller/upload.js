import conf from '../config'


export default {
	async imgUpload(ctx, next){
		var imgname = ctx.req.file.filename

		ctx.send({url: `${conf.server.domain}/images/${imgname}`})
	}
}