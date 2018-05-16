'use strict';
const Schema = global.mongoose.Schema;
const table = process.env.EXPANSE_APP+'_paymentshare';
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

	getTotalDepositByUser : function(id, groupId,  callback) {
		MODEL.aggregate([
		
		{
	        $match: {
	        	paidFor : new ObjectId(groupId),
	            paidBy: new ObjectId(id),
	            type :  'Deposit'
	            }
	     }, 

	     {
	         $group: {
	                _id: null, 
	                total :{$sum :'$amount'}
	                }
	     }
		]).then((data)=>{
			
			if(data && data.length >0) {
				callback(data[0].total)	
			} else {
				callback(0)
			}
			
		})
	},

	
	
	
}

module.exports = Group;