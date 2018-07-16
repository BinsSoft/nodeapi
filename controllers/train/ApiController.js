const api = {
	key : 'cf1de6ecb6d81d7fdbbd4a0ee20df4d5',
	url : 'https://api.railbeeps.com/api/'
}
var request 		= require('request');
module.exports = {

	trainDetails(req, res) {
		
		let apiUrl = api.url+'fetchAvailability/api-key/web-'+ api.key+'/trainno/'+req.body.trainid+'/from/'+req.body.source+'/to/'+req.body.dest+'/doj/'+global.moment().format('YYYY-MM-DD');
		//let apiUrl = 'http://testyourprojects.biz/custom/test_tonmoy/train.json';
		request(apiUrl, function(error, response){
			let data = JSON.parse(response.body);
			let result = {
				status : 1,
				body : data
			}
			res.send(result);
		})
	},

	trainNameSearch(req, res) {
		let searchQuery = req.query.s;
		searchQuery = searchQuery.toUpperCase();
		let apiUrl = api.url+'searchTrains/api-key/web-'+api.key+'?trainno='+searchQuery;
		request(apiUrl, function(error, response){
			let data = JSON.parse(response.body);
			res.send({
				status : 1,
				body : data
			});
		})
	},

	trainBetweenStation(req, res) {
		let apiUrl = api.url+'getTrainsBetweenStations/api-key/web-'+ api.key+'/from/'+req.body.source+'/to/'+req.body.destination+'/date/'+global.moment().format('YYYY-MM-DD')+'/sortby/departure/orderby/ASC/search/yes';

		request(apiUrl, function(error, response){
			let data = JSON.parse(response.body);
			res.send({
				status : 1,
				body : data
			});
		})
		
	},

	trainCurrentStatus(req, res) {
		let apiUrl = api.url+'getRunningStatus/api-key/web-'+ api.key+'/trainno/'+req.body.trainid+'/date/'+global.moment().format('YYYY-MM-DD');
		//let apiUrl = 'http://testyourprojects.biz/custom/test_tonmoy/train.json';
		
		request(apiUrl, function(error, response){
			let data = JSON.parse(response.body);
			res.send({
				status : 1,
				body : data
			});
		})
	}
	
}