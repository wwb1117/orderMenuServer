/*
 * @Author: zhangyong
 * @Date:   2018-04-17
 * @Descrition : wechat 微信支付功能
 */

var queryString = require('querystring');
var crypto = require('crypto');
var request = require('request');
var uuid = require('uuid');
// var sql = require('./assets/sql/sql')
var xml2jsparseString = require('xml2js').parseString;
// 引入项目的配置信息
import configm from '../config'

var config = configm.wx

// wechat 支付类 (使用 es6 的语法)
class WechatAppletPay {
	/**
	 * 构造函数
	 * @param params 传递进来的方法
	 */
	constructor(userInfo) {
		this.userInfo = userInfo;
		this.order_id = "";
	}

	/**
	 * 获取微信统一下单参数
	 */
	getUnifiedorderXmlParams(obj) {

		var body = '<xml> ' +
			'<appid>' + config.wxappid + '</appid> ' +
			'<body>' + obj.body + '</body> ' +
			'<mch_id>' + config.mch_id + '</mch_id> ' +
			'<nonce_str>' + obj.nonce_str + '</nonce_str> ' +
			'<notify_url>' + obj.notify_url + '</notify_url>' +
			'<openid>' + obj.openid + '</openid> ' +
			'<out_trade_no>' + obj.out_trade_no + '</out_trade_no>' +
			'<spbill_create_ip>' + obj.spbill_create_ip + '</spbill_create_ip> ' +
			'<total_fee>' + obj.total_fee + '</total_fee> ' +
			'<trade_type>' + obj.trade_type + '</trade_type> ' +
			'<sign>' + obj.sign + '</sign> ' +
			'</xml>';
		return body;
	}

	/**
	 * 获取微信统一下单的接口数据
	 */
	getPrepayId(obj) {
		var that = this;
		// 生成统一下单接口参数
		var UnifiedorderParams = {
			appid: config.wxappid,
			body: obj.body,
			mch_id: config.mch_id,
			nonce_str: this.createNonceStr(),
			notify_url: obj.notify_url, // 微信付款后的回调地址
			openid: this.userInfo.openid,
			out_trade_no: uuid.v4().replace(/-/g, ''), //new Date().getTime(), //订单号
			spbill_create_ip: obj.spbill_create_ip,
			total_fee: obj.total_fee,
			trade_type: 'JSAPI'
		};
		that.order_id = UnifiedorderParams.out_trade_no;
		// 返回 promise 对象
		return new Promise(function (resolve, reject) {
			// 获取 sign 参数
			UnifiedorderParams.sign = that.getSign(UnifiedorderParams);

			var url = 'https://api.mch.weixin.qq.com/pay/unifiedorder';
			request.post({
				url: url,
				body: JSON.stringify(that.getUnifiedorderXmlParams(UnifiedorderParams))
			}, function (error, response, body) {
				var prepay_id = '';
				if (!error && response.statusCode == 200) {
					// 微信返回的数据为 xml 格式， 需要装换为 json 数据， 便于使用
					xml2jsparseString(body, {
						async: true
					}, function (error, result) {
						prepay_id = result.xml.prepay_id[0];
						// 放回数组的第一个元素
						resolve(prepay_id);
					});
				} else {
					reject(body);
				}
			});
		})
	}

	/**
	 * 获取微信支付的签名
	 * @param payParams
	 */
	getSign(signParams) {
		// 按参数名ASCII码从小到大排序
		var keys = Object.keys(signParams);
		keys = keys.sort();
		var newArgs = {};
		keys.forEach(function (val, key) {
			if (signParams[val]) {
				newArgs[val] = signParams[val];
			}
		})
		// 拼接API密钥
		var string = queryString.stringify(newArgs) + '&key=' + config.wxpaykey;
		// 生成签名
		return crypto.createHash('md5').update(queryString.unescape(string), 'utf8').digest("hex").toUpperCase();
	}

	/**
	 * 微信支付的所有参数
	 * @param req 请求的资源, 获取必要的数据
	 */
	getBrandWCPayParams(obj) {
		let res = {}
		var that = this;
		var prepay_id_promise = that.getPrepayId(obj);

		return prepay_id_promise.then(function (prepay_id) {
			var prepay_id = prepay_id;
			var wcPayParams = {
				"appId": config.wxappid, // 微信小程序的APPID
				"timeStamp": parseInt(new Date().getTime() / 1000).toString(), //时间戳，自1970年以来的秒数
				"nonceStr": that.createNonceStr(), // 随机串
				// 通过统一下单接口获取
				"package": "prepay_id=" + prepay_id,
				"signType": "MD5", // 微信签名方式：
			};
			wcPayParams.paySign = that.getSign(wcPayParams); //微信支付签名
			wcPayParams.order_id = that.order_id; //微信支订单号

			return wcPayParams
		});
	}

	/**
	 * 获取随机的NonceStr
	 */
	createNonceStr() {
		return Math.random().toString(36).substr(2, 15);
	};

}

export default WechatAppletPay