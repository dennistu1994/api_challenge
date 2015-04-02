var APIHelper = require('./api_helper.js');
var MatchProcessor = require('./match_processor.js');
var DbHelper = require('./db_helper.js');
//APIHelper.get_nurf_match_ids(1427866500, function(res){
//	console.log(res);
//	DbHelper.insert_nurf_match_ids(1427866500, res, function(){
//		DbHelper.close();
//	});
//	MatchProcessor.process_nurf_match(res, function(){
//		DbHelper.close();
//	});
console.log('hi');
DbHelper.get_next_unprocessed_match_ids(function(res){
	console.log(res.match_ids.length);
	DbHelper.close();
});