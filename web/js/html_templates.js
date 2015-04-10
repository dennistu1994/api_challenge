define(['config'], function(Config){
	var HTMLTemplates = {
		get_champion_icon: function(champion_name, champion_key){
			var icon = $('<span class="champion_icon" title="'+champion_name+'" style="background-image: url(http://ddragon.leagueoflegends.com/cdn/'+Config.ddragon_version+'/img/champion/'+champion_key+'.png);"></span>');
			return icon[0];
		},
		
		get_value_span: function(name, value){
			return $('<span class="'+name+'">'+value+'</span>')[0];
		},
		
		get_placeholder_span: function(name){
			return $('<span class="'+name+'">'+HTMLTemplates.spinner+'</span>')[0];
		},
		
		get_average_kda_spans: function(k, d, a){
			return '<span class="average_kills">'+k.toFixed(1)+'</span>/<span class="average_deaths">'+d.toFixed(1)+'</span>/<span class="average_assists">'+a.toFixed(1)+'</span>';
		},
		
		spinner: '<span class="spinner"></span>'
	};
	
	return HTMLTemplates;
});