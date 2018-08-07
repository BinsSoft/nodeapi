var express 	= 	require('express');
var router 		=   express.Router();

const Controller = require("../systems/controllers");
let prefix = '/weather-api/';
router.post(prefix+'current/', Controller.weather.WeatherController.currentWeather);
router.post(prefix+'forcast/', Controller.weather.WeatherController.forcastWeather);

module.exports = router;