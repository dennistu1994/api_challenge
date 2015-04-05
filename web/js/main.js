require(['scheduler', 'ajax_helper', 'task_factory'], function(Scheduler, AjaxHelper, TaskFactory){
	var basic_stats_available = false;
	AjaxHelper.get_champion_statistics(function(res){
		basic_stats_available = true;
		window.basic_stats = res;
		
		window.calculated_stats = {};
		
		var calculate_win_rate = TaskFactory.calculate_win_rate(res.data);
		Scheduler.queue_task(calculate_win_rate);
		
		var sort_by_win_rate = TaskFactory.sort_by_win_rate(res.data, function(){
			window.calculated_stats.sort_by_win_rate = sort_by_win_rate.context.result;
			sort_by_win_rate.context.result.forEach(function(champ){
				console.log(champ.name, champ.win_rate);
			});
		});
		Scheduler.queue_task(sort_by_win_rate);
		
		var calculate_matches_analyzed = TaskFactory.calculate_matches_analyzed(res.data, function(){
			window.calculated_stats.matches_analyzed = calculate_matches_analyzed.context.result;
		});
		Scheduler.queue_task(calculate_matches_analyzed);
		
		var calculate_total_win_count = TaskFactory.calculate_total_win_count(res.data, function(){
			window.calculated_stats.total_win_count = calculate_total_win_count.context.result;
		});
		Scheduler.queue_task(calculate_total_win_count);
	});
});