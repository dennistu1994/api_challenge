define(['config', 'html_templates'], function(Config, HTMLTemplates){
	var EventHandlers = {
		champion_array: null,
		
		champion_search: function(){
			if(!EventHandlers.champion_array){
				return;
			} else {
				for(var i = 0;i < EventHandlers.champion_array.length; i++){
					if(EventHandlers.champion_array[i].icon){
						var regex;
						if(this.value === '666'){
							regex = new RegExp('the Swift Scout');
						} else {
							regex = new RegExp(this.value, "i");
						}
						if(regex.exec(EventHandlers.champion_array[i].name) || regex.exec(EventHandlers.champion_array[i].key) || regex.exec(EventHandlers.champion_array[i].title)){
							EventHandlers.champion_array[i].gray = false;
							if($(this).data('instant')){
								$('.active [data-champion-key="'+EventHandlers.champion_array[i].key+'"]').removeClass('gray').stop().css({opacity: 1});
								$(this).data('instant', false);
							} else{
								$('.active [data-champion-key="'+EventHandlers.champion_array[i].key+'"]').removeClass('gray').stop().animate({opacity: 1}, Config.icon_fade_duration);
							}
						} else {
							EventHandlers.champion_array[i].gray = true;
							if($(this).data('instant')){
								$('.active [data-champion-key="'+EventHandlers.champion_array[i].key+'"]').addClass('gray').stop().css({opacity: Config.gray_icon_opacity});
								$(this).data('instant', false);
							} else{
								$('.active [data-champion-key="'+EventHandlers.champion_array[i].key+'"]').addClass('gray').stop().animate({opacity: Config.gray_icon_opacity}, Config.icon_fade_duration);
							}
						}
					}
				}
			}
		},
		
		show_champion_statistics: function(){
			//set modal data
			var champion = $(this).data('champion');
			$('.champion_statistics_modal .champion_portrait').css('background-image', 'url(\''+HTMLTemplates.get_icon_url(champion.key)+'\')');
			$('.champion_statistics_modal .champion_name').html(champion.name);
			$('.champion_statistics_modal .champion_title').html(champion.title);
			$('.champion_statistics_modal .match_count_placeholder').html(champion.match_count_span);
			$('.champion_statistics_modal .ban_count_placeholder').html(champion.ban_count_span);
			$('.champion_statistics_modal .ban_rate_placeholder').html(champion.ban_rate_span);

			$('.champion_statistics_modal .win_rate_placeholder').html(champion.win_rate_span);
			$('.champion_statistics_modal .average_kda_placeholder').html(champion.average_kda_span);
			$('.champion_statistics_modal .penta_kills_placeholder').html(champion.penta_kills_span);

			$('.champion_statistics_modal').modal({
	 	 		"show" : true
	 	 	});
		},
		
		show_sorted_panel: function(){
			$('.champion_statistics.active').removeClass('active');
			$('.'+$(this).data('target-class')).addClass('active');
			$('input.champion_search').data('instant', true).trigger('input');
		}
	};
	return EventHandlers;
});