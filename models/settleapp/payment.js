'use strict';
const Schema = global.mongoose.Schema;
const table = process.env.SETTLE_APP + '_payment';
var ObjectId = global.mongoose.Types.ObjectId;
const model_schema = new Schema({ type: Schema.Types.Mixed }, { strict: false, versionKey: false })
const MODEL = global.mongoose.model(
    table,
    model_schema,
    table);
const PayPerson = {
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

    insert: function(data, callback) {
        var insertdata = new MODEL(data);
        insertdata.save(function(err, data) {
            if (err) {
                callback(err);
            } else {
                callback(data);
            }
        });

    }
};

module.exports = PayPerson;