define(function(){
	var AjaxHelper = {};
	
	AjaxHelper.get_champion_statistics = function(callback){
		$.ajax({
			url:'https://api-challenge-web.herokuapp.com/data',
			method:"POST",
			data:JSON.stringify({
				action: 'get_champion_statistics'
			}),
			contentType:"application/json; charset=utf-8",
			dataType:"json",
			success: function(res){
				if(typeof callback==="function"){
					callback(res);
				} else {
					console.log(res);
				}
			}
		});
	}
	
	return AjaxHelper;
});