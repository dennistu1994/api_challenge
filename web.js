var http = require('http');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var DbHelper = require('./db_helper.js');

DbHelper.init(function(){
	app.use(bodyParser.json());
	app.use("/", express.static('web/'));
	app.post('/data', function(req, res){
		res.header('Access-Control-Allow-Origin', '*');
		//move the handler to a seperate file
		if(req.body){
			var action = req.body.action;
			switch(action){
				case 'get_champion_statistics':
					DbHelper.get_champion_statistics(function(data, from_cache){
						res.json({data: data, from_cache: from_cache});
					});
					break;
				default:
					res.json('unknown action');
					break;
			}
		} else {
			res.status(500).send('error');
		}
	});
	
	http.createServer(app).listen(process.env.PORT);
	console.log('web server started on port '+process.env.PORT);
});