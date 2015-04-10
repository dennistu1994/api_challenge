define(['config'], function(Config){
	var EventHandlers = {
		champion_array: null,
		
		champion_search: function(){
			if(!EventHandlers.champion_array){
				return;
			} else {
				for(var i = 0;i < EventHandlers.champion_array.length; i++){
					if(EventHandlers.champion_array[i].icon){
						var regex = new RegExp(this.value, "i");
						if(regex.exec(EventHandlers.champion_array[i].name) || regex.exec(EventHandlers.champion_array[i].key)){
							EventHandlers.champion_array[i].gray = false;
							$('[data-champion-key="'+EventHandlers.champion_array[i].key+'"]').removeClass('gray').stop().animate({opacity: 1}, Config.icon_fade_duration);
						} else {
							EventHandlers.champion_array[i].gray = true;
							$('[data-champion-key="'+EventHandlers.champion_array[i].key+'"]').addClass('gray').stop().animate({opacity: Config.gray_icon_opacity}, Config.icon_fade_duration);
						}
					}
				}
			}
		},
		
		show_champion_statistics: function(){
			//set modal data
			var champion = $(this).data('champion');
			console.log(champion);
			$('.champion_statistics_modal .champion_name').html(champion.name);
			$('.champion_statistics_modal .champion_title').html(champion.title);
			$('.champion_statistics_modal .match_count_placeholder').html(champion.match_count_span);
			$('.champion_statistics_modal .win_rate_placeholder').html(champion.win_rate_span);
			$('.champion_statistics_modal .average_kda_placeholder').html(champion.average_kda_span);
			$('.champion_statistics_modal .penta_kills_placeholder').html(champion.penta_kills_span);

			$('.champion_statistics_modal').modal({
	 	 		"show" : true
	 	 	});
		}
	};
	return EventHandlers;
});