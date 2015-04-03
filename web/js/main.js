require(['scheduler', 'ajax_helper'], function(Scheduler, AjaxHelper){
	AjaxHelper.get_champion_statistics(function(res){
		console.log(res);
	});
	//var calculate_win_rate = new Scheduler.Task({});
});