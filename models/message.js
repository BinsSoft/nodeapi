'use strict';
const Schema = global.mongoose.Schema;
const table = 'messages';

const User =  require('./users');
const MessagesRecipients =  require('./messagerecipients');
const model_schema = new Schema(
		{ type: Schema.Types.Mixed },
		{ strict : false, versionKey: false }
		);
const MODEL = global.mongoose.model(
	table, 
	model_schema, 
	table);
const Messages = {


	send : function(recipients, bcc, postBy, msg, subject, callback) {
		
		var data = {
			subject : subject,
			body : msg,
			postBy : global.mongoose.Types.ObjectId(postBy),
			postedOn : new Date() 
		};
		
		
		data.recipients = [];
		User.fetch({email: {$in:recipients}}, function(recData){
			for (var rec of recData) {
				var row = {
					id : rec.get('_id'),
					name : rec.get('firstname'),
					bcc : false
				};
				if(bcc.indexOf(rec.get('email')) > -1) {
					row.bcc = true;
				}
				data.recipients.push(row);
			}
			var insertdata = new MODEL(data);
			insertdata.save(function(err,data){
				if (err) {
				callback(err);
				} else {
					callback(data);
				}
			})
		})
		
	},

	getSentMessagesCount : function(postBy, callback) {
		MODEL.count({postBy : postBy})
		.exec()
		.then((data)=>{
			callback(data);
		})
	},
	getSentMessages : function(postBy, offset, limit, callback) {
		MODEL.find({postBy : postBy})
		.sort({postedOn:-1})
		.skip(offset)
		.limit(limit)
		.exec()
		.then((data)=>{
			callback(data);
		})
	},

	getInboxMessagesCount : function(postBy, callback) {
		MODEL.count({"recipients": { $elemMatch: { id : postBy} }})
		.exec()
		.then((data)=>{
			callback(data);
		})
	},
	getInboxMessages : function(postBy, offset, limit, callback) {

		MODEL.find({"recipients": { $elemMatch: { id : postBy} }})
		.sort({postedOn:-1})
		.skip(offset)
		.limit(limit)
		.exec()
		.then((data)=>{
			var record = [];
			for(let count  in data) {
				let r = data[count];
				
				User.fetch({ _id:r.get('postBy') }, (userData)=>{
					var row = {
						_id : r.get('_id'),
						subject : r.get('subject'),
						body : r.get('body'),
						postedOn : r.get('postedOn')
					};
					row.postName = userData[0].get('firstname')
					record.push(row);
					if(count == (data.length-1) ) {
						callback(record);
					}
				})
				
			}
			
		})
	},

	setStared : function(msgId, callback) {
		MODEL.findOne({_id: global.mongoose.Types.ObjectId(msgId)})
		.exec()
		.then(data => {
			var updateData ={};

			if (data.get('stared')) {
				updateData.stared = false;
			} else {
				updateData.stared = true;
			}
			MODEL.update({_id : global.mongoose.Types.ObjectId(msgId)}, {$set : updateData},{upsert: true}, function(err, res){
		        callback(updateData);
		    })
		})
	}

}
module.exports = Messages;