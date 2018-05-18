const Model = require("../../systems/model");
var ObjectId = global.mongoose.Types.ObjectId;
module.exports = {
	create : function(req, res) {
		var postData = req.body;
		if(postData.startdate) {
			postData.startdate = new Date(postData.startdate);
		}
		Model.expense.group.insert(postData, (returnData) => {
			var members = req.body.members;
			var admin = members.find(function(m){
				return m.admin == 1;
			})
			var promises = [];
			for(let index in members) {
				
				promises[index] = new Promise(function(resolve, reject){
					var m = members[index];
					if (m.deposit > 0) {
						Model.expense.payment.insert({
							paidBy : new ObjectId(m.id),
							groupId : new ObjectId(returnData._id),
							sharewith : [{id : new ObjectId(admin.id), name : admin.name}],
							amount : parseInt(m.deposit),
							parHeadAmount : parseInt(m.deposit),
							type : 'Deposit',
							addedBy : new ObjectId(admin.id),
							addedOn : new Date(),
						}, (payData)=> {})
					}

				});
			}
			Promise.all(promises).then(res.send(returnData));
			
		})
	},
	getUserGroups : function(req, res) {

		global.systems.model.expense.group.userGroups(req.body.id, (returnData)=>{
			res.send(returnData);
		})
	},
	getGroupDetails:function(req,res)
	{
		global.systems.model.expense.group.getGroupDetails(req.body.id, (returnData)=>{
			if(returnData){
				var membersList = [];
				var members = returnData.get('members');
				var promises = [];
				var totalAmount = 0;

				for (let m of members) {
					promises.push(new Promise(function(resolve, reject) {
						
						global.systems.model.expense.payment.getTotalDepositByUser(m.id, returnData.get('_id'), (depositByData)=>{

							global.systems.model.expense.payment.getTotalExpecsePaidByUser(m.id, returnData.get('_id'), (paidByData)=>{
								global.systems.model.expense.payment.getTotalExpecsePaidForUser(m.id, returnData.get('_id'), (paidForData)=>{
									
									var row = {
										index : members.indexOf(m),
										id : m.id,
										name : m.name,
										admin : m.admin,

										deposit : parseFloat(depositByData).toFixed(2),
										paidBy : parseFloat(paidByData).toFixed(2),
										paidFor : parseFloat(paidForData).toFixed(2),
										balance : parseFloat((depositByData +paidByData ) - paidForData).toFixed(2)
									}
									resolve(row);
									
								});
								
							})
						});
					}) );
				}
				Promise.all(promises).then(function(membersList){
					global.systems.model.expense.payment.getTotalExpecseByGroupAmount(req.body.id, (amount)=>{
						totalAmount  = amount;
						res.send({	name : returnData.get('name'), 
								id : returnData.get('_id'), 
								createdBy : returnData.get('createdBy'), 
								createdOn : returnData.get('createdOn'), 
								startdate : returnData.get('startdate'),
								totalAmount : parseFloat(totalAmount).toFixed(2),
								members : membersList});
					});
					
				})
				
			}
		});
	},

	memberDepositEdit : function(req, res)
	{

		global.systems.model.expense.group.editDeposit(req.body.groupId,req.body.memberId, req.body.deposit.new, (returnData)=>{

			var newDeposit = req.body.deposit.new - req.body.deposit.old;
			global.systems.model.expense.payment.insert({
				paidBy : new ObjectId(req.body.memberId),
				groupId : new ObjectId(req.body.groupId),
				sharewith : [{id : new ObjectId(req.body.admin.id), name : req.body.admin.name  }],
				amount : newDeposit,
				parHeadAmount : newDeposit,
				type : 'Deposit',
				addedBy : new ObjectId(req.body.admin.id),
				addedOn : new Date(),
			}, (payData)=> {
				res.send({success:1})
				
			})
		})
	},

	memberSavePay : function(req, res) {
		let payData = {
			paidBy : new ObjectId(req.body.payBy),
			groupId : new ObjectId(req.body.groupId),
			amount : parseInt(req.body.amount),
			type : req.body.category,
			description : req.body.description,
			payDate : new Date(req.body.payDate),
			sharewith : [],
			addedBy : new ObjectId(req.body.addedBy),
			addedOn : new Date(),
		};
		let parHeadAmount = (payData.amount / req.body.shareMembers.length).toFixed(2);
		payData.parHeadAmount = parseFloat(parHeadAmount);
		for (let m of req.body.shareMembers)
		{
			payData.sharewith.push({
				id : new ObjectId(m.id),
				name : m.name,
			})
		}
		global.systems.model.expense.payment.insert(payData, (returnData)=>{
			res.send({msg : 'success'});
		})

	},

	groupExpenseHistory : function(req, res)
	{
		groupId  = req.body.id;
		var promises = [];
		var result = [];
		global.systems.model.expense.payment.getGroupExpense(groupId, (responseData)=>{
			for(let expense of responseData) {

				

				promises.push( new Promise((resolve, reject)=>{

					global.systems.model.expense.users.fetchOne({_id : new ObjectId(expense.get('paidBy'))}, (userData)=>{
						var row = {
							id : expense._id,
							description : expense.get('description'),
							amount : parseFloat(expense.get('amount')).toFixed(2),
							type : expense.get('type'),
							payDate : expense.get('payDate'),
							sharewith : expense.get('sharewith'),
							paidUser : userData.get('name'),
							paidBy : userData.get('_id')
						}
							
							resolve(row);
					})
				}))
			}
			Promise.all(promises).then((expenseList)=>{
				res.send(expenseList);
			})
		});
		
	},

	deleteGroupExpense : function(req, res) {
		global.systems.model.expense.payment.deleteExpense(req.body.id, (responsedata)=>{
			res.send({status : responsedata});
		})
	}
}