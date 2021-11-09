var express = require('express');
var router = express.Router();
const Controller = require("../systems/controllers");
global.app.use(function(req, response, next) {
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Credentials", "true");
    response.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    response.setHeader("Access-Control-Allow-Headers", "access-control-allow-credentials,access-control-allow-headers,access-control-allow-methods,access-control-allow-origin,content-type");
    return next();
});
let prefix = process.env.SETTLE_APP;
router.post("/" + prefix + "/signup", Controller.settleapp.AuthController.signup);
router.post("/" + prefix + "/login", Controller.settleapp.AuthController.login);
router.post("/" + prefix + "/pay/type", Controller.settleapp.PaymentController.getPayTypeList);
router.post("/" + prefix + "/pay/type/add", Controller.settleapp.PaymentController.addPayType);
router.post("/" + prefix + "/pay/person/list", Controller.settleapp.PaymentController.getPersonList);
router.post("/" + prefix + "/payment", Controller.settleapp.PaymentController.addPayment);
router.post("/" + prefix + "/pay/list", Controller.settleapp.PaymentController.getPaymentList);


module.exports = router;