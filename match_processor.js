//this module processes match data
var DbHelper = require('./db_helper');
var MatchProcessor = {};

MatchProcessor.process_nurf_match = function(match_data, callback){
	//store the match
	if(match_data.matchId){
		//valid
		DbHelper.insert_nurf_match(match_data, function(noerr){
			if(noerr){
				var i,
				champion_stats={}; //championId as key, statistics as value
				//update champion statistics
				for(i = 0; i < match_data.participants.length; i++){
					//select only stats that have significant meaning
					champion_stats[match_data.participants[i].championId] = {
						match_count: 1,
						win_count: (match_data.participants[i].stats.winner?1:0),
						kills: match_data.participants[i].stats.kills,
						double_kills: match_data.participants[i].stats.doubleKills,
						triple_kills: match_data.participants[i].stats.tripleKills,
						quadra_kills: match_data.participants[i].stats.quadraKills,
						penta_kills: match_data.participants[i].stats.pentaKills,
						deaths: match_data.participants[i].stats.deaths,
						assists: match_data.participants[i].stats.assists,
						damage_dealt_to_champions: match_data.participants[i].stats.totalDamageDealtToChampions,
						damage_taken: match_data.participants[i].stats.totalDamageTaken,
						heal: match_data.participants[i].stats.totalHeal,
						minions_killed: match_data.participants[i].stats.minionsKilled,
						gold_earned: match_data.participants[i].stats.goldEarned,
						cc_seconds: match_data.participants[i].stats.totalTimeCrowdControlDealt,
						killing_sprees: match_data.participants[i].stats.killingSprees,
						first_blood: (match_data.participants[i].stats.firstBloodKill?1:0)
					};
				}
				DbHelper.increment_champion_stats(champion_stats, callback);
			} else {
				console.log('already processed match '+match_data.matchId);
				callback(false);
			}
		});
	} else {
		console.log('invalid match data');
		console.log(match_data);
		callback(false);
	}
};

module.exports = MatchProcessor;