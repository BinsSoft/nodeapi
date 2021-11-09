const Model = require("../../systems/model");
const ObjectId = global.mongoose.Types.ObjectId;
module.exports = {
    getPayTypeList: (req, res) => {
        global.systems.model.settleapp.paytype.fetch({}, (data) => {
            res.send({ status: 1, message: 'success', payload: data });
        })
    },
    addPayType: (req, res) => {
        var postData = req.body;
        global.systems.model.settleapp.paytype.insert(postData, (data) => {
            res.send({ status: 1, message: 'success' });
        })
    },
    getPersonList: (req, res) => {
        var postData = req.body;
        postData.user_id = new ObjectId(postData.user_id);
        global.systems.model.settleapp.payperson.fetch({
            user_id: postData.user_id
        }, (data) => {
            res.send({ status: 1, message: 'success', payload: data });
        })
    },
    addPayment: (req, res) => {
        var postData = req.body;
        postData.type_id = new ObjectId(postData.type_id);
        postData.user_id = new ObjectId(postData.user_id);
        if (postData.person_id === 'others') {
            const personPostData = {
                name: postData.other_person_name,
                user_id: postData.user_id
            }
            global.systems.model.settleapp.payperson.insert(personPostData, (data) => {
                postData.person_id = data.get('_id');
                delete postData.other_person_name;
                global.systems.model.settleapp.payment.insert(postData, (personResponse) => {
                    res.send({ status: 1, message: 'success' });
                });
            })
        } else {
            postData.person_id = new ObjectId(postData.person_id);
            global.systems.model.settleapp.payment.insert(postData, (personResponse) => {
                res.send({ status: 1, message: 'success' });
            });
        }

    },
    getPaymentList: (req, res) => {}
}