require(['scheduler', 'ajax_helper', 'task_factory', 'event_handlers'], function(Scheduler, AjaxHelper, TaskFactory, EventHandlers){
	$(function(){
		var basic_stats_available = false;
		AjaxHelper.get_champion_statistics(function(res){
			basic_stats_available = true;
			window.basic_stats = res;
			EventHandlers.champion_array = res.data;
			
			var make_champion_html = TaskFactory.make_champion_html(res.data);
			Scheduler.queue_task(make_champion_html);
			
			$('input.champion_search').on('input', EventHandlers.champion_search);
			$('.panel.champion_statistics').on('click', '.champion_icon', EventHandlers.show_champion_statistics);

			window.calculated_stats = {};
			
			var calculate_average_kda = TaskFactory.calculate_average_kda(res.data);
			Scheduler.queue_task(calculate_average_kda);
			
			var calculate_win_rate = TaskFactory.calculate_win_rate(res.data);
			Scheduler.queue_task(calculate_win_rate);
			
			var sort_by_win_rate = TaskFactory.sort_by_win_rate(res.data, function(){
				window.calculated_stats.sort_by_win_rate = sort_by_win_rate.context.result;
				sort_by_win_rate.context.result.forEach(function(champ){
					console.log(champ.name, champ.id, champ.win_rate);
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
});