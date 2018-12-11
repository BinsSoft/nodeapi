var fs 				= require('fs');
var HomeController = {


	index  : function(request, response){
		//response.render("index");
		response.send("index");
	},

}
module.exports =  HomeController;