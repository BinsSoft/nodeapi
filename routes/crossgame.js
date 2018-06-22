var express 	= 	require('express');
var router 		=   express.Router();

const Controller = require("../systems/controllers");
let prefix = 'crossgame';
global.io.on('connection', Controller.crossgame.Socketcontroller.index);

module.exports = router;