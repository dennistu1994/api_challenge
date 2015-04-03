var Constants = require('./constants.js');
var DbHelper = require('./db_helper.js');
var APIHelper = require('./api_helper.js');
var MatchProcessor = require('./match_processor.js');
var Worker = {
	last_api_call: 0,
	last_match_ids_pull: 0,
	now: 0,
	unprocessed_match_ids: null
};

Worker.get_next_unprocessed_match_ids = function(callback, onerr){
	DbHelper.get_next_unprocessed_match_ids(function(match_ids){
		if(match_ids){
			console.log('got unprocessed match_ids for: '+match_ids.timestamp);
			Worker.unprocessed_match_ids = match_ids;
			if(typeof callback === 'function'){
				callback();
			}
		} else {
			//no more unprocessed
			console.log('nothing to do');
			if(typeof onerr === 'function'){
				onerr();
			}
		}

	});
};

Worker.process_next_match_id = function(){
	if(!Worker.unprocessed_match_ids) {
		//get new batch
		Worker.get_next_unprocessed_match_ids(Worker.process_next_match_id);
	} else if(Worker.unprocessed_match_ids.match_ids.length === 0) {
		//finished with this batch
		console.log('marking '+Worker.unprocessed_match_ids.timestamp+' as processed');
		DbHelper.mark_match_ids_processed(Worker.unprocessed_match_ids.timestamp, function(){
			Worker.get_next_unprocessed_match_ids(Worker.process_next_match_id);
		});
	} else {
		
		var next_match_id = Worker.unprocessed_match_ids.match_ids.pop();
		console.log('processing: '+ next_match_id +' from timestamp '+Worker.unprocessed_match_ids.timestamp);
		//get the match data
		APIHelper.get_match(next_match_id, function(match_data){
			MatchProcessor.process_nurf_match(match_data, function(success){
				//need to reprocess this match id as there was a failure
				if(!success){
					Worker.unprocessed_match_ids.push(next_match_id);
				}
			});
		});
	}
};

Worker.task = function(){
	Worker.now = Date.now();

	if(Worker.now - Worker.last_api_call > Constants.API_CALL_INTERVAL){
		//can perform a riot games api call
		if((Worker.now - Worker.last_match_ids_pull) > Constants.MATCH_IDS_PULL_INTERVAL /*MATCH_IDS_PULL_INTERVAL*/ ) {
			//pull some match ids
			DbHelper.get_highest_timestamp(function(timestamp){
				var next_timestamp = timestamp + 300; //5 minutes is the next timestamp to pull match ids with
				if((next_timestamp * 1000) < (Worker.now - Constants.TEN_MINUTES)){ //only pull if the timestamp is at least 10 minutes before current time
					APIHelper.get_nurf_match_ids(next_timestamp, function(match_ids){
						DbHelper.insert_nurf_match_ids(next_timestamp, match_ids, function(){
							var tmp = new Date(0);
							tmp.setUTCSeconds(next_timestamp);
							console.log('pulled match_ids for : '+tmp);
						});
					});
					Worker.last_api_call = Worker.now;
					Worker.last_match_ids_pull = Worker.now;
				} else {
					//caught up with match_ids
					//do something else, a match_pull maybe?
					Worker.process_next_match_id();
				}
			});
		} else {
			//perform a match pull if possible
			Worker.process_next_match_id();
		}
	}
	//can't call riot api, do something

	//schedule next task
	setTimeout(Worker.task, Constants.WORKER_TASK_INTERVAL);
};

Worker.task();
module.exports = Worker;