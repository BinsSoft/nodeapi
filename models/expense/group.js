'use strict';
const ModelMaster = require("../../systems/model");
const Schema = global.mongoose.Schema;
const table = process.env.EXPANSE_APP+'_group';
var ObjectId = global.mongoose.Types.ObjectId;
const model_schema = new Schema(
		{ type: Schema.Types.Mixed }, 
		{ strict : false, versionKey: false }
		)
const MODEL = global.mongoose.model(
	table, 
	model_schema, 
	table);
const Group = {
	insert : function(data,callback) {
		
		var insertdata = new MODEL(data);
		insertdata.save(function(err,data){
			if (err) {
			callback(err);
			} else {
			callback(data);
			}
		});
	},

	userGroups : function(userId, callback) {
		MODEL.find({ 
				"members": { $elemMatch: { id : userId} }
			})
			.exec()
			.then( (data)=>{
					
					var promises = [];
					for(let d of data) {
						promises.push( new Promise(function(resolve, reject){
							
							global.systems.model.expense.payment.getTotalExpecseByGroupAmount(d.get('_id'), (amount)=>{
								var row = {
									id : d.get('_id'),
									name : d.get('name'),
									date : d.get('startdate'),
									amount : parseFloat(amount).toFixed(2)
								};

								resolve(row);
							})
						}) )
					}
					Promise.all(promises).then(function(result){
						callback(result)	
					});
					
			})
	},

	getGroupDetails : function(id, callback)
	{
		MODEL.findOne({_id : new ObjectId(id)})
		.exec()
		.then((data)=>{
			callback(data)
		});
	},

	editDeposit : function(groupId, memberId, newDepositAmount, callback)
	{
		MODEL.update(
          {
            _id : groupId,
            members: { $elemMatch: { id : memberId } }
          },
          {
            $set : {
              "members.$.deposit" : newDepositAmount
            }
          },
          {upsert: true}, 
          function(err, res){
            callback(res);
          })
	},

	addMember(groupId, userData, callback) {
		MODEL.update({ _id : new ObjectId(groupId) }, {$push : {members: userData}} , {upsert: true}, (err,data)=>{
			callback(data);
		} )
	}
}

module.exports = Group;