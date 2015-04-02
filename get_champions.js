var APIHelper = require('./api_helper.js');
var DbHelper = require('./db_helper.js');
APIHelper.get_champions(function(res){
	var champions_array = [];
	for(var key in res.data){
		champions_array.push(res.data[key]);
	};
	DbHelper.update_champion_information(champions_array, function(res){
		DbHelper.close();
	});
});