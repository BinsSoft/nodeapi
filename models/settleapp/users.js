'use strict';
const Schema = global.mongoose.Schema;
const table = process.env.SETTLE_APP + '_users';
var ObjectId = global.mongoose.Types.ObjectId;
const model_schema = new Schema({ type: Schema.Types.Mixed }, { strict: false, versionKey: false })
const MODEL = global.mongoose.model(
    table,
    model_schema,
    table);
const User = {
    fetch: function(query, callback) {
        MODEL.find(query)
            .exec()
            .then(function(data) {
                callback(data);
            })
    },
    fetchOne: function(query, callback) {
        MODEL.findOne(query)
            .exec()
            .then(function(data) {
                callback(data);
            })
    },
    searchByName: function(name, callback) {
        MODEL.find()
            .and([
                { $or: [{ "name": new RegExp(name, 'i') }] }
            ])
            .exec()
            .then(function(data) {
                callback(data);
            })
    },
    checkPhoneExist: function(phoneno, callback) {
        MODEL.findOne({ phoneno: phoneno })
            .exec()
            .then(function(data) {
                callback(data);
            })
    },

    insert: function(data, callback) {
        var insertdata = new MODEL(data);
        insertdata.save(function(err, data) {
            if (err) {
                callback(err);
            } else {
                callback(data);
            }
        });
        /*global.systems.config.bcrypt.init().hash(data.password, global.systems.config.bcrypt.saltRounds, function(err, hash) {
        	data.password = hash;
        	var insertdata = new MODEL(data);
        	insertdata.save(function(err,data){
        		if (err) {
        		callback(err);
        		} else {
        		callback(data);
        		}
        	});
        });*/
    },
    checkLogin: function(postData, callback) {
        MODEL.findOne({ phoneno: postData.phoneno, password: postData.password }).exec().then(function(data) {

                if (data) {

                    callback({ status: true, user: data });
                } else {
                    callback({ status: false });
                }
            })
            /*MODEL.findOne({phoneno: postData.phoneno}).exec().then(function(data){
            	
            	if(data) {

            		global.systems.config.bcrypt.init().compare(postData.password, data.get('password'), function(err, hashData) {

            			callback({status:hashData, user : data});
            		});		
            	} else {
            		callback({status: false});
            	}
            })*/

    },

    resetPassword: function(postData, callback) {
        MODEL.update({ _id: new ObjectId(postData.id) }, {
            $set: {
                "password": postData.password
            }
        }, { upsert: true }, (err, data) => {
            callback(data);
        })
    },

    checkUuid(uuid, callback) {
        MODEL.findOne({ uuid: uuid }).exec()
            .then((data) => {
                callback(data);
            })
    }
};

module.exports = User;