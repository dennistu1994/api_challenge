require(['scheduler', 'ajax_helper', 'task_factory'], function(Scheduler, AjaxHelper, TaskFactory){
	var stats_available = false;
	AjaxHelper.get_champion_statistics(function(res){
		var calculate_win_rate = TaskFactory.calculate_win_rate(res.data);
		Scheduler.queue_task(calculate_win_rate);
		var sort_by_win_rate = TaskFactory.sort_by_win_rate(res.data, function(){
			console.log(res.data);
		});
		Scheduler.queue_task(sort_by_win_rate);
		
		stats_available = true;
	});
});