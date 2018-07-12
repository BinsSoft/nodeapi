const api = {
	key : 'cf1de6ecb6d81d7fdbbd4a0ee20df4d5',
	url : 'https://api.railbeeps.com/api/'
}
var request 		= require('request');
module.exports = {

	trainDetails(req, res) {
		//res.send(req.body);
		//https://api.railbeeps.com/api/fetchAvailability/api-key/web-cf1de6ecb6d81d7fdbbd4a0ee20df4d5/trainno/3159/from/3440/to/312/doj/Thu,%2012th%20Jul

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
		let apuUrl = api.url+'getTrainsBetweenStations/api-key/web-'+ api.key+'/from/'+req.body.source+'/to/'+req.body.destination+'/date/'+global.moment().format('YYYY-MM-DD')+'/sortby/departure/orderby/ASC/search/yes';

		request(apuUrl, function(error, response){
			let data = JSON.parse(response.body);
			res.send({
				status : 1,
				body : data
			});
		})
		
	}
}