var APIHelper = require('./api_helper.js');
var DbHelper = require('./db_helper.js');
DbHelper.reset_champion_statistics(function(){
	DbHelper.close();
});