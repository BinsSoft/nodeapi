const express 		= require('express');
global.app 			= express();
const http 			= require('http').Server(global.app);
global.fs 			= require("fs");
global.path 		= require('path');
global.multer 		= require('multer');
global.bodyParser 	= require('body-parser');
global.session 		= require('express-session');
global.Cookies 		= require('cookies');
require('dotenv').config();

global.app.use( global.bodyParser.json({limit: '50mb'}) );       // to support JSON-encoded bodies

global.app.use(global.bodyParser.urlencoded({ extended: false,
    parameterLimit: 1000000,
	limit: '50mb'}));;

global.app.use(global.session({
    secret: '2C44-4D44-WppQ38S',
    resave: true,
    saveUninitialized: true,
    cookie: {
	    path: '/',
	    httpOnly: true,
	    secure: false,
	    maxAge: 8640000
	  },
	rolling: true
}));
app.use(express.static(__dirname + '/public'));
global.systems = require('./systems');

global.app.set('port', (process.env.PORT || 3000));
http.listen(global.app.get('port'), function(){
  console.log("1) Message App Server starts");
  console.log("2) It is running with port " + global.app.get('port'));
});
