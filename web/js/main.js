require(['scheduler', 'ajax_helper', 'task_factory', 'event_handlers', 'html_templates'], function(Scheduler, AjaxHelper, TaskFactory, EventHandlers, HTMLTemplates){
	$(function(){
		var basic_stats_available = false;
		AjaxHelper.get_champion_statistics(function(res){
			basic_stats_available = true;
			EventHandlers.champion_array = res.data;
			
			var make_champion_html = TaskFactory.make_champion_html(res.data);
			Scheduler.queue_task(make_champion_html);
			
			$('.total_match_count_placeholder').html(HTMLTemplates.spinner);
			$('input.champion_search').on('input', EventHandlers.champion_search).prop('disabled', false);
			$(window).on('keydown', function(e){
				if (e.keyCode === 114 || (e.ctrlKey && e.keyCode === 70)) { 
					$('input.champion_search').focus();
					e.preventDefault();
			    }
			});
			$('.panel.champion_statistics').on('click', '.champion_icon_container', EventHandlers.show_champion_statistics);
			$('.sort_by_menu').on('click', 'a', EventHandlers.show_sorted_panel);
			
			window.calculated_stats = {};
			
			var calculate_average_kda = TaskFactory.calculate_average_kda(res.data);
			Scheduler.queue_task(calculate_average_kda);
			
			var calculate_win_rate = TaskFactory.calculate_win_rate(res.data, function(){
				var sort_by_win_rate = TaskFactory.sort_by('win_rate', res.data, function(){
					var show_sorted_by_win_rate = TaskFactory.show_sorted_champion_array(sort_by_win_rate.context.result, '.panel.champion_statistics.sorted_by_win_rate', 'Win Rate', 'win_rate_percent');
					Scheduler.queue_task(show_sorted_by_win_rate);
					Scheduler.set_focus(show_sorted_by_win_rate);
				});
				Scheduler.queue_task(sort_by_win_rate);
				Scheduler.set_focus(sort_by_win_rate);
			});
			Scheduler.queue_task(calculate_win_rate);
			
			
			
			var sort_by_penta_kills = TaskFactory.sort_by('penta_kills', res.data, function(){
				var show_sorted_by_penta_kills = TaskFactory.show_sorted_champion_array(sort_by_penta_kills.context.result, '.panel.champion_statistics.sorted_by_penta_kills', 'Pentakills', 'penta_kills');
				Scheduler.queue_task(show_sorted_by_penta_kills);
				Scheduler.set_focus(show_sorted_by_penta_kills);
			});
			Scheduler.queue_task(sort_by_penta_kills);
			
			var calculate_matches_analyzed = TaskFactory.calculate_matches_analyzed(res.data, function(){
				window.calculated_stats.matches_analyzed = calculate_matches_analyzed.context.result;
				var sort_by_ban_rate = TaskFactory.sort_by('ban_rate', res.data, function(){
					var show_sorted_by_ban_rate = TaskFactory.show_sorted_champion_array(sort_by_ban_rate.context.result, '.panel.champion_statistics.sorted_by_ban_rate', 'Ban Rate', 'ban_rate_percent');
					Scheduler.queue_task(show_sorted_by_ban_rate);
					Scheduler.set_focus(show_sorted_by_ban_rate);
				});
				Scheduler.queue_task(sort_by_ban_rate);
			});
			Scheduler.queue_task(calculate_matches_analyzed);
		});
	});
});