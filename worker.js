var Constants = require('./constants.js');
var DbHelper = require('./db_helper.js');
var APIHelper = require('./api_helper.js');
var MatchProcessor = require('./match_processor.js');
var Worker = {
	last_api_call: 0,
	last_match_ids_pull: 0,
	now: 0,
	unprocessed_match_ids: null,
	next_timestamp_override: -1
};

Worker.get_next_unprocessed_match_ids = function(callback, onerr){
	DbHelper.get_next_unprocessed_match_ids(function(match_ids){
		if(match_ids){
			console.log('got unprocessed match_ids for: '+match_ids.timestamp);
			if(match_ids.match_ids instanceof Array){
				Worker.unprocessed_match_ids = match_ids;
				Worker.unprocessed_match_ids.num_match_ids = match_ids.match_ids.length;
				Worker.unprocessed_match_ids.num_processed = 0;
				if(typeof callback === 'function'){
					callback();
				}
			} else {
				console.log(match_ids.match_ids);
				//rate limit error, retro fix here
				console.log('going to repull match_ids for timestamp: '+match_ids.timestamp);
				Worker.next_timestamp_override = match_ids.timestamp;
				
				if(typeof onerr === 'function'){
					onerr();
				}
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
		Worker.get_next_unprocessed_match_ids();
	} else if(Worker.unprocessed_match_ids.num_processed === Worker.unprocessed_match_ids.num_match_ids) {
		//finished with this batch
		console.log('marking batch '+Worker.unprocessed_match_ids.timestamp+' as processed');
		DbHelper.mark_match_ids_processed(Worker.unprocessed_match_ids.timestamp);
		Worker.unprocessed_match_ids = null;
	} else {
		if(Worker.unprocessed_match_ids.match_ids.length){
			var next_match_id = Worker.unprocessed_match_ids.match_ids.pop();
			console.log('processing match '+ next_match_id +' from timestamp '+Worker.unprocessed_match_ids.timestamp);
			//get the match data
			APIHelper.get_match(next_match_id, function(match_data){
				MatchProcessor.process_nurf_match(match_data, function(success){
					//need to reprocess this match id as there was a failure
					if(!success){
						Worker.unprocessed_match_ids.match_ids.push(next_match_id);
					} else {
						Worker.unprocessed_match_ids.num_processed++;
					}
				});
			});
		} else {
			console.log(Worker.unprocessed_match_ids);
			console.log('waiting for matches to finish processing');
		}
	}
};

Worker.task = function(){
	Worker.now = Date.now();

	if(Worker.now - Worker.last_api_call > Constants.API_CALL_INTERVAL){
		//can perform a riot games api call
		Worker.last_api_call = Worker.now;
		if( ((Worker.now - Worker.last_match_ids_pull) > Constants.MATCH_IDS_PULL_INTERVAL) || Worker.next_timestamp_override > 0) {
			//pull some match ids
			Worker.last_match_ids_pull = Worker.now;
			if(Worker.next_timestamp_override > 0){
				var next_timestamp = Worker.next_timestamp_override;
				APIHelper.get_nurf_match_ids(next_timestamp, function(match_ids){
					if(match_ids instanceof Array){
						DbHelper.insert_nurf_match_ids(next_timestamp, match_ids, function(){
							var tmp = new Date(0);
							tmp.setUTCSeconds(next_timestamp);
							console.log('pulled match_ids for : '+tmp);
						});
					} else {
						var tmp = new Date(0);
						tmp.setUTCSeconds(next_timestamp);
						console.log('error pulling match_ids for : '+tmp, match_ids);
					}

				});
				Worker.next_timestamp_override = -1;
			} else {
				DbHelper.get_highest_timestamp(function(timestamp){
					var next_timestamp = timestamp + 300; //5 minutes is the next timestamp to pull match ids with
					if((next_timestamp * 1000) < (Worker.now - Constants.TEN_MINUTES)){ //only pull if the timestamp is at least 10 minutes before current time
						APIHelper.get_nurf_match_ids(next_timestamp, function(match_ids){
							if(match_ids instanceof Array){
								DbHelper.insert_nurf_match_ids(next_timestamp, match_ids, function(){
									var tmp = new Date(0);
									tmp.setUTCSeconds(next_timestamp);
									console.log('pulled match_ids for : '+tmp);
								});
							} else {
								var tmp = new Date(0);
								tmp.setUTCSeconds(next_timestamp);
								console.log('error pulling match_ids for : '+tmp, match_ids);
							}
						});
					} else {
						//caught up with match_ids
						//do something else, a match_pull maybe?
						Worker.process_next_match_id();
					}
				});
			}
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