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
						name : u.get('name'),
						phoneno : u.get('phoneno')
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
	},

	backup(req, res) {
		var filePath = '';
		var model = "";
		switch (req.params.type) {
			case "user":
				filePath = 'public/expense/backup/users.json';
				model = global.systems.model.expense.users;
			break;
			case "group":
				filePath = 'public/expense/backup/groups.json';
				model = global.systems.model.expense.group;
			break;
			case "payment":
				filePath = 'public/expense/backup/payments.json';
				model = global.systems.model.expense.payment;
			break;
		}
		model.fetch({},(data)=> {
			data  = JSON.stringify(data);
			//res.send(data);
			global.fs.writeFile(filePath, data, function(err){
				if (err) {
					res.send(err);
				}
				res.send("done");
			});
		})
		
	},
	
}