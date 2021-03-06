// md5计算
var md5 = require('md5');
// 定时任务
var schedule = require('node-schedule');
// 加载配置文件
var CONFIG = require('./../config');
// 加载api
var adminApi = require('./../apis/adminApi');
// 非管理员api中的一部分可以复用
var webApi = require('./../apis/webApi');

const app = require('./../app');

// 管理员登录
app.post('/slogin', function(req, res) {

	var password = req.body.password;
	if (password) {
		var md5Password = md5(password);
		if (md5Password === CONFIG.SPASSWORD) {
			req.session.sadmin = true;
			res.send({status: 1000});
		}
		else {
			res.send({status: 2005});
		}
	}
	else {
		res.send({status: 1002, desc: 'password required'});
	}
});

// 统一中间件，用于验证登录信息
app.use('/admin', function(req, res, next) {

	// 统一验证session，
	if (req.session.sadmin === true) {
		next();
	}
	else {
		res.send({status: 1001});
	}
});

// 注销
app.get('/admin/logout', function(req, res) {

	req.session.destroy(function(err) {
		if (err) {
			res.send({status: 1003, desc: err});
		}
		else {
			res.send({status: 1000});
		}
	});
});

// 创建游戏局
app.get('/admin/createGame', function(req, res) {

	var gameId = req.query.id;
	var disableTime = parseInt(req.query.disable_time);
	var closeTime = parseInt(req.query.close_time);
	if (gameId && disableTime && closeTime) {
		adminApi.createGame(gameId, disableTime, closeTime, function(resultMap) {
			res.send(resultMap);
		});
	}
	else {
		res.send({status: 1002});
	}
});

// 封盘
app.get('/admin/disableGame', function(req, res) {

	var gameId = req.query.id;
	adminApi.disableGame(gameId, function(resultMap) {
		res.send(resultMap);
	});
});

// 更新结果
app.get('/admin/updateGameResult', function(req, res) {

	var resutlNumber = Number(req.query.result_no);
	var gameId = req.query.id;
	adminApi.updateGameResult(gameId, resutlNumber, function(resultMap) {
		res.send(resultMap);
	});
});

// 更新余额
app.get('/admin/updateUserBalance', function(req, res) {

	var gameId = req.query.id;
	adminApi.updateUserBalance(gameId, function(resultMap) {
		res.send(resultMap);
	});
});
