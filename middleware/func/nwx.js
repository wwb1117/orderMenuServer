/**
 * Created by dhy on 17/4/17.
 */
var http = require("http"),
	fs = require("fs"),
	data = {
		"path": "pages/homePage/homePage",
		"width": 430
	};
data = JSON.stringify(data);

//https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET    GET   获取access_token的接口
var options = {
	method: "POST",
	host: "api.weixin.qq.com",
	path: "/cgi-bin/wxaapp/createwxaqrcode?access_token=ypDm00u1CqpPSbYFxw2VM0kfBh3aAPYSLC8uI0f2e_xPjr_L1jBldcqaC-h4bkqk9QJrPfLNAtwSfFEIC_PmMUX4r2QbdKZ_iBMyx7m9uWWFGt6wXXBrRPkJ_f-0iz7YEHJcACAKNP",
	//记得更换token token有效时间2h
	headers: {
		"Content-Type": "application/json",
		"Content-Length": data.length
	}
};
var req = http.request(options, function (res) {
	res.setEncoding("binary");
	var imgData = "";
	res.on('data', function (chunk) {
		imgData += chunk;
	});
	res.on("end", function () {
		fs.writeFile("./wx_liteQR.jpeg", imgData, "binary", function (err) {
			if (err) {
				console.log("down fail");
			}
			console.log("down success");
		});
	});
});
req.write(data);
req.end();