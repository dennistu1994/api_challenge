define(['scheduler'], function(Scheduler){
	var TaskFactory = {};
	TaskFactory.calculate_win_rate = function(champion_array, callback){
		return new Scheduler.Task({
			data: champion_array,
			current_index: 0
		}, function(){
			//step
			this.data[this.current_index].win_rate =  this.data[this.current_index].win_count/this.data[this.current_index].match_count //I should rename this
			this.current_index++;
		}, function(){
			//condition
			return this.current_index === this.data.length;
		}, callback);
	};
	
	TaskFactory.sort_by_win_rate = function(champion_array, callback){
		return new Scheduler.Task({
			data: champion_array,
			result: [],
			index: 0
		}, function(){
			var next = this.data[this.index];
			if(this.index === 0){
				this.result.push(next);
			} else {
				var temp = 0;
				while (next.win_rate < this.result[temp].winrate){
					temp++;
				}
				this.result.splice(temp, 0, next); //insertion sort
			}
			this.index++;
		}, function(){
			return this.index === this.data.length;
		}, callback);
	};
	
	return TaskFactory;
});