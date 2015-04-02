var https = require('https');

var na_endpoint = 'na.api.pvp.net';
var match_api = '/api/lol/na/v2.2/match/';
var champion_api = '/api/lol/static-data/na/v1.2/champion';
var api_challenge_api = '/api/lol/na/v4.1/game/ids';
var api_key = '3a65e0b7-dc5a-49b6-b0f5-27d2d4c524aa';

var APIHelper = {};

APIHelper.get_nurf_match_ids = function(timestamp, callback){
	https.request({
		host: na_endpoint,
		path: api_challenge_api+'?api_key='+api_key+'&beginDate='+timestamp,
		method: 'GET'
	}, function(res){
		var str = '';
		res.on('data', function(data){
			str += data;
		});
		res.on('end', function(){
			callback(JSON.parse(str));
		});
	}).end();
};

APIHelper.get_match = function(match_id, callback){
	https.request({
		host: na_endpoint,
		path: match_api+match_id+'?api_key='+api_key,
		method: 'GET'
	}, function(res){
		var str = '';
		res.on('data', function(data){
			str += data;
		});
		res.on('end', function(){
			callback(JSON.parse(str));
		});
	}).end();
}

APIHelper.get_champions = function(callback){
	https.request({
		host: na_endpoint,
		path: champion_api+'?api_key='+api_key,
		method: 'GET'
	}, function(res){
		var str = '';
		res.on('data', function(data){
			str += data;
		});
		res.on('end', function(){
			callback(JSON.parse(str));
		});
	}).end();
};

module.exports = APIHelper;