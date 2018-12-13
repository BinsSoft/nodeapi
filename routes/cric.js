var express 	= 	require('express');
var router 		=   express.Router();
const Controller = require("../systems/controllers");
/*global.app.use(function(req, response, next) {
   response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Credentials", "true");
    response.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    response.setHeader("Access-Control-Allow-Headers", "access-control-allow-credentials,access-control-allow-headers,access-control-allow-methods,access-control-allow-origin,content-type");
  return next();
});*/
let prefix = process.env.CRIC_APP;
router.post("/"+prefix+"/", Controller.cric.DataController.notAccess);
router.post("/"+prefix+"/live-matches", Controller.cric.DataController.index);
router.post("/"+prefix+"/match/:id", Controller.cric.DataController.details);
router.post("/"+prefix+"/match-score/:id", Controller.cric.DataController.renderMatchScore);
router.post("/"+prefix+"/series", Controller.cric.DataController.renderSeries);
router.post("/"+prefix+"/series-details/:id/:slug", Controller.cric.DataController.renderSerieDetails);
router.post("/"+prefix+"/ranking/:type", Controller.cric.DataController.randerRanking);
router.post("/"+prefix+"/ranking/:type/:matchType/:position", Controller.cric.DataController.randerRanking)
router.post("/"+prefix+"/news", Controller.cric.DataController.renderNews);
module.exports = router;
