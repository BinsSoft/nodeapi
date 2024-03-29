const Model = require("../../systems/model");
module.exports = {
    signup: function(req, res) {
        var postData = req.body;
        postData.phoneno = (postData.phoneno).toString();
        global.systems.model.settleapp.users.checkPhoneExist(postData.phoneno, (checkData) => {
            if (checkData) {
                res.send({ status: 0, message: 'Phone no is exist please try other one' });
            } else {

                global.systems.model.settleapp.users.insert(postData, (data) => {
                    res.send({ status: 1, message: 'success' });
                })
            }
        })
    },
    login: function(req, res) {
        var postData = req.body;
        var postElements = {
            phoneno: (postData.phoneno).toString(),
            password: postData.password
        }
        global.systems.model.settleapp.users.checkLogin(postElements, (checkData) => {

            if (checkData.status == true) {

                const userdata = {
                        id: checkData.user.get('_id'),
                        name: checkData.user.get('name'),
                        phone: checkData.user.get('phoneno')
                    }
                    //res.send(postData);
                res.send({ status: 1, message: 'success', userdata: userdata })


            } else {

                res.send({ status: 0, message: 'Login Failed, check phone no and password' });
            }
        });
    },

    resetPassword: function(req, res) {
        global.systems.model.settleapp.users.resetPassword(req.body, (responsedata) => {
            res.send({ status: true });
        })
    }
}