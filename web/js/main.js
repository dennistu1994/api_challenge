require(['scheduler', 'ajax_helper', 'task_factory'], function(Scheduler, AjaxHelper, TaskFactory){
	var stats_available = false;
	AjaxHelper.get_champion_statistics(function(res){
		var calculate_win_rate = TaskFactory.calculate_win_rate(res.data);
		//Scheduler.add_task(calculate_win_rate);
		
		stats_available = true;
	});
});