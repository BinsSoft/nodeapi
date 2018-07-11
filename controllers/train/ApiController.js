const api = {
	key : 'cf1de6ecb6d81d7fdbbd4a0ee20df4d5',
	url : 'https://api.railbeeps.com/api/'
}
var request 		= require('request');
module.exports = {

	trainDetails(req, res) {
		
		const trainNo = req.params.id;
		let apuUrl = api.url+'searchTrains/api-key/web-'+ api.key+'?trainno='+trainNo;
		request(apuUrl, function(error, response){
			let data = JSON.parse(response.body);
			let result = {
				status : 0,
				body : {}
			}
			if(data.length > 0) {
				result.status = 1;
				result.body = data[0]; 
			}
			res.send(result);
		})
	},

	trainNameSearch(req, res) {
		let searchQuery = req.query.s;
		const file = 'public/train/stations.json';
		global.fs.readFile(file, 'utf8', function (err, stations){
			stations = JSON.parse(stations);
			let searchData = stations.find((i)=>{
				return i.code.startsWith(searchQuery) || i.display.startsWith(searchQuery) 
			});
			res.send(searchData);
		});
	},

	trainBetweenStation(req, res) {
		let apuUrl = api.url+'getTrainsBetweenStations/api-key/web-'+ api.key+'/from/'+req.body.source+'/to/'+req.body.destination+'/date/'+global.moment().format('YYYY-MM-DD')+'/sortby/departure/orderby/DESC/search/yes';

		request(apuUrl, function(error, response){
			let data = JSON.parse(response.body);
			res.send({
				status : 1,
				body : data
			});
		})
		
	}
}