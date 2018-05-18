'use strict';
const Schema = global.mongoose.Schema;
const table = process.env.EXPANSE_APP+'_payment';
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
	getTotalExpecseByGroupAmount : function(id, callback) {
		MODEL.aggregate([
		{
	        $match: {
	            groupId: new ObjectId(id),
	            type :  {$ne : 'Deposit'}
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
	getTotalExpecseAmount : function(id,callback) {
		MODEL.aggregate([
		{
	        $match: {
	            paidFor: new ObjectId(id)
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

	getTotalDepositByUser : function(id, groupId,  callback) {
		MODEL.aggregate([
		
		{
	        $match: {
	        	groupId : new ObjectId(groupId),
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
	getTotalExpecsePaidByUser : function(id, groupId,  callback) {
		
		MODEL.aggregate([
		
		{
	        $match: {
	        	groupId : new ObjectId(groupId),
	            paidBy: new ObjectId(id),
	            type : {$ne : 'Deposit'}
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
	
	getTotalExpecsePaidForUser : function(id, groupId, callback) {

		MODEL.aggregate([
		{
	        $match: {
	        	groupId : new ObjectId(groupId),
	            sharewith: { $elemMatch: { id : new ObjectId(id) } }
	            }
	     }, 
	     {
	         $group: {
	                _id: null, 
	                total :{$sum :'$parHeadAmount'}
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

	getGroupExpense(groupId, callback)
	{
		MODEL.find(
			{
				groupId : new ObjectId(groupId),
				type : { $ne : 'Deposit' }
			})
		.sort({payDate: -1})
		.exec()
		.then((data)=>{
			callback(data);
		})
	},
	deleteExpense(expenseId, callback) {
		MODEL.remove({_id: new ObjectId(expenseId)}, function(err){
			if(!err) {
				callback(true);
			} else {
				callback(false);
			}
		})
	}
}

module.exports = Group;