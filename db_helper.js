var Constants = require('./constants.js');
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var ObjectID = mongodb.ObjectID;

var nurf_match_ids =  null;
var nurf_matches = null;
var champions = null;
var champion_statistics = null;
var database = null;

var DbHelper = {
	inited: false,
	init_called: false,
	init_queue: []
};

DbHelper.init = function(callback){
	if(this.inited){
		callback();
	} else {
		if(this.init_called){
			//waiting
			this.init_queue.push(callback);
		} else {
			MongoClient.connect(Constants.TEST_MONGODB_HOST, function(err, db) {
				//connected to db
				if(!err){
					if(database){
						//close existing connection
						database.close();
					}
					database = db;
					nurf_match_ids = database.collection('nurf_match_ids');
					nurf_matches = database.collection('nurf_matches');
					matches = database.collection('nurf_matches');
					champions = database.collection('champions');
					champion_statistics = database.collection('champion_statistics');
					DbHelper.inited = true;
					var next_in_queue = DbHelper.init_queue.shift();
					while(typeof next_in_queue === 'function'){
						next_in_queue(!err);
						next_in_queue = DbHelper.init_queue.shift();
					};
					if(typeof callback === 'function'){
						callback(!err);
					}
				}
			});
		}
	}
	this.init_called = true;
};

DbHelper.insert_nurf_match_ids = function(timestamp, match_ids, callback){
	this.init(function(){
		//match_ids is an array of long numbers
		nurf_match_ids.insert([{
			timestamp: timestamp,
			match_ids: match_ids,
			processed: false
		}], function(err, res){
			if(typeof callback === 'function'){
				callback(!err);
			}
		});
	});
}

//get the timestamp of the latest batch of match ids
DbHelper.get_highest_timestamp = function(callback){
	this.init(function(){
		nurf_match_ids.findOne({},{
			sort: {
				timestamp: -1
			}
		}, function(err, res){
			callback(res.timestamp);
		});
	});
};

//get the next batch of unprocessed batch of match ids
DbHelper.get_next_unprocessed_match_ids = function(callback){
	this.init(function(){
		nurf_match_ids.findOne({
			timestamp: {$gt: 0},
			processed: false
		},{
			fields: {
				'_id': 0
			},
			sort: {
				timestamp: 1
			}
		}, function(err, res){
			if(typeof callback === 'function'){
				callback(res);
			}
		});
	});
};

DbHelper.mark_match_ids_processed = function(timestamp, callback){
	this.init(function(){
		nurf_match_ids.update({
			timestamp: timestamp
		},{
			$set: {
				processed: true
			}
		}, function(err, res){
			if(typeof callback === 'function'){
				callback(!err);
			}
		});
	});
};

DbHelper.insert_nurf_match = function(match_data, callback){
	this.init(function(){
		//match_ids is an array of match ids
		nurf_matches.insert([match_data], function(err, res){
			if(typeof callback === 'function'){
				callback(!err);
			}
		});
	});
};

DbHelper.increment_champion_stats = function(data, callback){
	this.init(function(){
		//match_ids is an array of match ids
		var count = 0;
		var champion_id;
		for(champion_id in data){
			count++;
			champion_statistics.update({
				id: parseInt(champion_id)
			}, {
				$inc: data[champion_id]
			}, function(err, res){
				count--;
				if(count == 0){
					if(typeof callback === 'function'){
						callback(!err);
					}
				}
			});
		}
	});
};

DbHelper.update_champion_information = function(data, callback){
	this.init(function(){
		//match_ids is an array of match ids
		champions.drop();
		champions.insert(data, function(err, res){
			if(typeof callback === 'function'){
				callback(!err);
			}
		});
	});
};

DbHelper.reset_champion_statistics = function(callback){
	this.init(function(){
		//match_ids is an array of match ids
		var stats = {
			match_count: 0,
			win_count: 0,
			kills: 0,
			double_kills: 0,
			triple_kills: 0,
			quadra_kills: 0,
			penta_kills: 0,
			deaths: 0,
			assists: 0,
			damage_dealt_to_champions: 0,
			damage_taken: 0,
			heal: 0,
			minions_killed: 0,
			gold_earned: 0,
			cc_seconds: 0,
			killing_sprees: 0,
			first_blood: 0
		};
		champion_statistics.update({}, {
			$set: stats
		}, {
			multi: true
		}, function(err, res){
			if(typeof callback === 'function'){
				callback(!err);
			}
		});
	});
};

DbHelper.close = function(){
	database.close();
};

module.exports = DbHelper;