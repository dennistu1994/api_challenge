var http = require('http');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var DbHelper = require('./db_helper.js');

DbHelper.init(function(){
	app.use("/", express.static('web/'));
	app.post('/data', function(req, res){
		//move the handler to a seperate file
		if(req.body){
			var action = req.body.action;
			switch(action){
				case 'create_user':
					res.json({test: 1});
					break;
				case 'authenticate_user':
					res.json({test: 1});
					break;
			}
		} else {
			res.status(500).send('error');
		}
	});
	
	http.createServer(app).listen(process.env.PORT);
	console.log('credentials server started');
});