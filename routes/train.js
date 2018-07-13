var express 	= 	require('express');
var router 		=   express.Router();

const Controller = require("../systems/controllers");
let prefix = '/train-api/';
router.post(prefix+'train-details/', Controller.train.ApiController.trainDetails);
router.get(prefix+'train-auto-search', Controller.train.ApiController.trainNameSearch);
router.post(prefix+'train-between-stations', Controller.train.ApiController.trainBetweenStation);
router.post(prefix+'train-current-status', Controller.train.ApiController.trainCurrentStatus);
module.exports = router;