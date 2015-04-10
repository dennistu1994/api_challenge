define(['scheduler', 'html_templates', 'config'], function(Scheduler, HTMLTemplates, Config){
	var TaskFactory = {};
	
	TaskFactory.make_champion_html = function(champion_array, callback){
		return new Scheduler.Task({
			data: champion_array,
			current_index: 0
		}, function(){
			//step
			this.data[this.current_index].icon =  HTMLTemplates.get_champion_icon(this.data[this.current_index].name, this.data[this.current_index].key);
			this.data[this.current_index].match_count_span = HTMLTemplates.get_value_span('match_count', this.data[this.current_index].match_count);
			this.data[this.current_index].penta_kills_span = HTMLTemplates.get_value_span('penta_kills', this.data[this.current_index].penta_kills);

			this.data[this.current_index].win_rate_span= HTMLTemplates.get_placeholder_span('win_rate');
			this.data[this.current_index].average_kda_span= HTMLTemplates.get_placeholder_span('average_kda');
			
			$(this.data[this.current_index].icon).data('champion', this.data[this.current_index]);
			$('.panel.champion_statistics.unsorted').append($(this.data[this.current_index].icon));
			this.current_index++;
		}, function(){
			//condition
			return this.current_index === this.data.length;
		}, callback);
	};
	
	TaskFactory.show_sorted_champion_array = function(champion_array, selector, callback){
		return new Scheduler.Task({
			data: champion_array,
			selector: selector,
			current_index: 0
		}, function(){
			//step
			if(this.current_index === 0){
				$(selector).html('');
			}
			var new_icon = $(this.data[this.current_index].icon).clone(true);
			$(selector).append(new_icon);
			if(this.data[this.current_index].gray === true){
				new_icon.children().css({opacity: Config.gray_icon_opacity});
			} else {
				new_icon.children().css({opacity: 1});
			}
			this.current_index++;
		}, function(){
			//condition
			return this.current_index === this.data.length;
		}, callback);
	};
	
	TaskFactory.calculate_win_rate = function(champion_array, callback){
		return new Scheduler.Task({
			data: champion_array,
			current_index: 0
		}, function(){
			//step
			this.data[this.current_index].win_rate =  this.data[this.current_index].win_count/this.data[this.current_index].match_count
			var percent = (Math.round(this.data[this.current_index].win_rate.toFixed(3)*1000)/10).toFixed(1);
			$(this.data[this.current_index].win_rate_span).html(percent+'%');
			this.current_index++;
		}, function(){
			//condition
			return this.current_index === this.data.length;
		}, callback);
	};
	
	TaskFactory.calculate_average_kda = function(champion_array, callback){
		return new Scheduler.Task({
			data: champion_array,
			current_index: 0
		}, function(){
			//step
			this.data[this.current_index].average_kills =  this.data[this.current_index].kills/this.data[this.current_index].match_count;
			this.data[this.current_index].average_deaths =  this.data[this.current_index].deaths/this.data[this.current_index].match_count;
			this.data[this.current_index].average_assists =  this.data[this.current_index].assists/this.data[this.current_index].match_count;
			$(this.data[this.current_index].average_kda_span).html(HTMLTemplates.get_average_kda_spans(this.data[this.current_index].average_kills, this.data[this.current_index].average_deaths, this.data[this.current_index].average_assists));
			
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
				while (this.result[temp] && (next.win_rate < this.result[temp].win_rate)){
					temp++;
				}
				this.result.splice(temp, 0, next); //insertion sort
			}
			this.index++;
		}, function(){
			return this.index === this.data.length;
		}, callback);
	};
	
	TaskFactory.sort_by = function(field_name, champion_array, callback){
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
				while (this.result[temp] && (next[field_name] < this.result[temp][field_name])){
					temp++;
				}
				this.result.splice(temp, 0, next); //insertion sort
			}
			this.index++;
		}, function(){
			return this.index === this.data.length;
		}, callback);
	};
	
	TaskFactory.calculate_matches_analyzed = function(champion_array, callback){
		return new Scheduler.Task({
			data: champion_array,
			current_index: 0,
			result: 0
		}, function(){
			//step
			this.result += this.data[this.current_index].match_count;
			this.current_index++;
		}, function(){
			//condition
			if(this.current_index === this.data.length){
				$('.total_match_count_placeholder').html(this.result/10);
				return true;
			}
		}, callback);
	};
	
	TaskFactory.calculate_total_win_count = function(champion_array, callback){
		return new Scheduler.Task({
			data: champion_array,
			current_index: 0,
			result: 0
		}, function(){
			//step
			this.result += this.data[this.current_index].win_count;
			this.current_index++;
		}, function(){
			//condition
			if(this.current_index === this.data.length){
				return true;
			}
		}, callback);
	};
	
	return TaskFactory;
});