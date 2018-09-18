var https = require('https');
// var querystring = require('querystring');
var request = require('request');

export const getAccessToken = () => {
	return new Promise((resolve, reject) => {
		https.get('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx3e388ef2b022d98c&secret=47e5261f217394acc006069270099ded', function (req, res) {
			var html = '';

			req.on('data', function (data) {
				html += data;
			});

			req.on('end', function () {
				resolve(JSON.parse(html).access_token)
			});
		}).on('error', (e) => {
			reject(e)
			console.error(`错误: ${e.message}`);
		})
	});
}
export const wx_getWXACode = (token, index) => {
	return new Promise((resolve, reject) => {
		const postData = {
			'scene': index,
			'page': '',
			'width': 200,
			'auto_color': false
		};

		request({
			url: 'https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token='+token,
			method: "POST",
			json: true,
			headers: {
				"content-type": "application/json",
			},
			body: postData
		}, function(error, response, body) {
			if (!error && response.statusCode == 200) {
				resolve(body)
			} else {
				reject(error)
			}
		});
		
	});
}