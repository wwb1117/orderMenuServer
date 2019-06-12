var https = require('https');
var http = require("http");
var fs = require("fs");
// var querystring = require('querystring');
// var request = require('request');

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
		var postData = {
			'scene': index,
			'page': '',
			'width': 200,
			'auto_color': false
		};
		postData = JSON.stringify(postData)
		var options = {
			method: "POST",
			host: "api.weixin.qq.com",
			path: "/wxa/getwxacodeunlimit?access_token=" + token,
			headers: {
				"Content-Type": "application/json",
				"Content-Length": postData.length
			}
		};

		var req = http.request(options, function (res) {
			res.setEncoding("binary");
			var imgData = "";
			res.on('data', function (chunk) {
				imgData += chunk;
			});
			res.on("end", function () {
				fs.writeFile('./public/code/imgcode'+ index +'.jpg', imgData, "binary", function (err) {
					if (err) {
						reject(err)
					}
					resolve(imgData)
				});
			});
		});
		req.write(postData);
		req.end();
		
	});
}
export const wx_getUserInfo = (code) => {
	return new Promise((resolve, reject) => {
		https.get('https://api.weixin.qq.com/sns/jscode2session?appid=wx2e4f118e527bcf44&secret=615c46da0cafbbd146972b9c662f5ee0&js_code='+code+'&grant_type=authorization_code', function (req, res) {
			var html = '';

			req.on('data', function (data) {
				html += data;
			});

			req.on('end', function () {
				resolve(JSON.parse(html))
			});
		}).on('error', (e) => {
			reject(e)
			console.error(`错误: ${e.message}`);
		})
	});
}