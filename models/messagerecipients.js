'use strict';
const Schema = global.mongoose.Schema;
const table = 'messagerecipients';
const MODEL = global.mongoose.model(
	table, 
	new Schema({ type: Schema.Types.Mixed }, { strict : false, versionKey: false }), 
	table);
const MessagesRecipients = {

	insert : function(data) {
		
		var insertdata = new MODEL(data);
		return insertdata.save();
	},

	fetch : function(query, callback) {
		MODEL.find(query)
		.exec()
		.then(function(data){
			callback(data);
		})
	},
}
module.exports = MessagesRecipients;