var express 	= 	require('express');
var router 		=   express.Router();
const Controller = require("../systems/controllers");
global.app.use(function(req, response, next) {
   response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Credentials", "true");
    response.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    response.setHeader("Access-Control-Allow-Headers", "access-control-allow-credentials,access-control-allow-headers,access-control-allow-methods,access-control-allow-origin,content-type");
  return next();
});
let prefix = process.env.CRIC_APP;
router.get("/"+prefix+"/", Controller.cric.DataController.notAccess);
router.get("/"+prefix+"/live-matches", Controller.cric.DataController.index);
router.get("/"+prefix+"/match/:id", Controller.cric.DataController.details);
router.get("/"+prefix+"/match-score/:id", Controller.cric.DataController.renderMatchScore);
router.get("/"+prefix+"/series", Controller.cric.DataController.renderSeries);
router.get("/"+prefix+"/series-details/:id/:slug", Controller.cric.DataController.renderSerieDetails);
router.get("/"+prefix+"/ranking/:type", Controller.cric.DataController.randerRanking);
router.get("/"+prefix+"/ranking/:type/:matchType/:position", Controller.cric.DataController.randerRanking)
router.get("/"+prefix+"/news", Controller.cric.DataController.renderNews);
module.exports = router;
