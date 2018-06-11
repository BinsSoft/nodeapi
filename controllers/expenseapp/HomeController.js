const Model = require("../../systems/model");
module.exports = {
	searchUser : function(req, res) {
		let term = req.query.term;
		var result = [];
		if(term != ''){
			Model.expense.users.searchByName(term, (data)=>{
				
				for(let u of data) {
					result.push({
						id : u.get('_id'),
						name : u.get('name')
					});
				}
				res.send(result)
			})
		} else {
			res.send(result)
		}
	},

	checkUuid(req, res)
	{
		let uuid = req.body.uuid;
		global.systems.model.expense.users.checkUuid(uuid, (responseData)=>{
			if(responseData) {
				res.send({
					status:1, 
					message : 'already inserted', 
					user : {
						id : responseData.get('_id'),
						name : responseData.get('name'),
						phone : responseData.get('phoneno')
					}
				});
			} else {
				res.send({status:0, message :'new uuid'});
			}
		})
	},

	removeUuid(req, res) {
		let uuid = req.body.uuid;
		global.systems.model.expense.users.removeUuid(uuid, (responseData)=>{
			res.send({"status":1});
		})
	}
}