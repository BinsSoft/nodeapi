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
	}
}