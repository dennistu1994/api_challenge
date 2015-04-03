require(['scheduler', 'ajax_helper'], function(Scheduler, AjaxHelper){
	AjaxHelper.get_champion_statistics(function(res){
		var calculate_win_rate = new Scheduler.Task({
			data: res,
			current_index: 0
		}, function(){
			this.data.data[current_index].win_rate =  this.data.data[current_index].win_count/this.data.data[current_index].match_count //I should rename this
			this.current_index++;
		}, function(){
			return this.current_index === this.data.data.length;
		}, function(){
			console.log(this.data);
		});

	});
});