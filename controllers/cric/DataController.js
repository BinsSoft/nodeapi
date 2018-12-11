var fs 				= require('fs');
var request 		= require('request');
var cheerio 		= require('cheerio');
var moment 			= require('moment');
var DataController 	= {

	// http://i.cricketcb.com/i/stats/flags/web/official_flags/team_58.png >>>> team image
	// http://i.cricketcb.com/stats/img/faceImages/413.jpg >>> player image
	index  : function(req, res){
		
	   
		var currentTime = moment().format("YYYY-MM-DD HH:mm:ss");
		var diff = null;
		fs.readFile("public/cric/livescores.json", 'utf8', function (err, liveData){
			if (liveData) {
				liveData = JSON.parse(liveData);
				var updateTime = liveData.updatedAt;
				diff = moment.duration(moment(currentTime).diff(moment(updateTime)));
			}
			
			if (diff === null || diff.asSeconds() > 30) {
				var url = "http://www.cricbuzz.com/cricket-match/live-scores";
				request(url, function(error, response, html){
					var $ = cheerio.load(html);
					var data = {};
					var matches = [];
					if ($(".cb-schdl").length > 0) {
						if ($(".cb-schdl").find('.cb-lv-main').length > 0) {
							$(".cb-schdl").find('.cb-lv-main').each(function(i,match){
								var mRow = {};
								
								mRow['series'] = $(match).find("h2.cb-lv-scr-mtch-hdr").text();
								mRow['name'] = $(match).find(".cb-lv-scrs-well").attr("title");
								mRow['link'] = $(match).find(".cb-lv-scrs-well").attr("href");
								var linkArr = mRow['link'].split("/");
								mRow['_id'] = linkArr[2];
								var className = $(match).find(".cb-lv-scrs-well").attr("class");
								if (className.indexOf("cb-lv-scrs-well-live") > -1) {
									mRow['status'] = 'live';	
								} else if (className.indexOf("cb-lv-scrs-well-complete") > -1) {
									mRow['status'] = 'complete';	
								}
								mRow['statusText'] = [];
								if ($(match).find(".cb-lv-scrs-col").length >0) {
									mRow['statusText'].push($(match).find(".cb-lv-scrs-col.text-black").text());
								}
								if ($(match).find(".cb-text-complete").length > 0) {
									mRow['statusText'].push($(match).find(".cb-text-complete").text());
								}
								else if ($(match).find(".cb-text-live").length > 0) {
									mRow['statusText'].push($(match).find(".cb-text-live").text());
								}
								matches.push(mRow);
							})
							data['matches'] = matches;
							data['updatedAt'] = currentTime;
							var storeData = JSON.stringify(data);
							fs.writeFile("public/cric/livescores.json", storeData, function(err){
								if (err) {
									console.log(err);
								}
							});
						}
					}
					res.send({data: data.matches});
				});
			} else {
				res.send({data: liveData.matches});
			}
		});

	},

	details : function(req, res) {
		const currentTime = moment().format("YYYY-MM-DD HH:mm:ss");
		const matchId = req.params.id;
		const file = "public/files/matches/"+matchId+".json";
		const url ='http://www.cricbuzz.com/match-api/'+matchId+'/commentary-full.json';
		if (fs.existsSync(file)) {
			fs.readFile(file, 'utf8', function (err, matchData){
				matchData = JSON.parse(matchData);
				var updateTime = matchData.updatedAt;
				var diff = moment.duration(moment(currentTime).diff(moment(updateTime)));
				if (diff.asSeconds() > 30) {

					request(url, function(error, response, matchJSON){
						var storeData = {};
						storeData['data'] = JSON.parse(matchJSON);
						storeData['updatedAt'] = currentTime;
						storeData = JSON.stringify(storeData);
						fs.writeFile(file, storeData, function(err){
							storeData = JSON.parse(storeData);
							DataController.rendermatchData(res, storeData);
						});
						
					});
				}

				DataController.rendermatchData(res, matchData);
			});
		} else {
			request(url, function(error, response, matchJSON){
				var storeData ={};
				storeData['data'] = JSON.parse(matchJSON);
				storeData['updatedAt'] = currentTime;
				storeData = JSON.stringify(storeData);
				fs.writeFile(file, storeData, function(err){
					storeData = JSON.parse(storeData);
					DataController.rendermatchData(res, storeData);
				});
				
			});
			
		}
		
	},

	renderMatchScore: function(req, res) {
		const matchId = req.params.id;
		const url = 'http://www.cricbuzz.com/api/html/cricket-scorecard/'+matchId;
		const currentTime = moment().format("YYYY-MM-DD HH:mm:ss");
		const file = "public/files/matches/scores/"+matchId+".json";
		
		if (fs.existsSync(file)) {
			fs.readFile(file, 'utf8', function (err, matchData){
				matchData = JSON.parse(matchData);
				var updateTime = matchData.updatedAt;
				var diff = moment.duration(moment(currentTime).diff(moment(updateTime)));
				if (diff.asSeconds() > 30) {
					DataController.writeMatchScore(file, url, currentTime,  res);
				} else {
					res.send({data: matchData.data});
				}
			});
		} else {
			DataController.writeMatchScore(file, url, currentTime, res);
		}
	},
	writeMatchScore : function(file, url, currentTime, res)
	{
		request(url, function(error, response, html){
					var storeData ={};
					//res.send(html);
					var $ = cheerio.load(html);
					var matchData = {};
					$("div[id^='innings_']").each(function(i,ins){
						var row = {};
						row.heading = $(ins).find(".cb-scrd-hdr-rw span").first().text();
						row.currentScore = $(ins).find(".cb-scrd-hdr-rw span").last().text();
						row.scores = [];
						$(ins).find('.cb-ltst-wgt-hdr').first().find(".cb-scrd-itms").each(function(bIndex, batsman){
							if(row.scores[bIndex] == undefined) row.scores[bIndex]= {};
							$(batsman).find(".cb-col").each(function(b, bData){
								var val = $(bData).text().trim();
								switch(b) {
									case 0:
									row.scores[bIndex].name = val.replace(/►/g, "");
									break;
									case 1:
									row.scores[bIndex].status = val;
									break;
									case 2:
									row.scores[bIndex].run = val;
									break;
									case 3:
									row.scores[bIndex].ball = val;
									break;
									case 4:
									row.scores[bIndex].fours = val;
									break;
									case 5:
									row.scores[bIndex].sixs = val;
									break;
								}
								
							})
							
						});

						var countSlise = 0;
						for( var s of row.scores ) {
							if(Object.keys(s).length < 4) {
								if (s.name == 'Total') {
									
									row.total = {
										run : s.status,
										ball : s.run,
									}; 
								} else if(s.name == 'Extras') {
									
									row.extra = {
										run : s.status,
										ball : s.run,
									};
								} else if(s.name == 'Did not Bat') {
									row.did_not_bat = {
										name : s.status
									};
								}
								countSlise ++;
							}
						}
						row.scores.splice(-countSlise,countSlise);
						

						var fallOfWickets = $(ins).find(".cb-col-rt").text();
						fallOfWickets = fallOfWickets.trim();
						fallOfWickets = fallOfWickets.slice(0, -1);
						row.fallOfWickets = fallOfWickets.split("),");
						row.fallOfWickets = row.fallOfWickets.map(function(e) {return  e+")"});

						row.bowlers = [];
						

						$(ins).find('.cb-ltst-wgt-hdr').eq(1).find(".cb-scrd-itms").each(function(bIndex, bowler){
							if(row.bowlers[bIndex] == undefined) row.bowlers[bIndex]= {};
							$(bowler).find(".cb-col").each(function(b, bData){
								var val = $(bData).text().trim();
								switch(b) {
									case 0:
									row.bowlers[bIndex].name = val;
									break;
									case 1:
									row.bowlers[bIndex].over = val;
									break;
									case 2:
									row.bowlers[bIndex].madin = val;
									break;
									case 3:
									row.bowlers[bIndex].run = val;
									break;
									case 4:
									row.bowlers[bIndex].wicket = val;
									break;
									case 5:
									row.bowlers[bIndex].NB = val;
									break;
									case 6:
									row.bowlers[bIndex].WD = val;
									break;
									case 7:
									row.bowlers[bIndex].ECO = val;
									break;
								}
								
							})
						});
						matchData[ $(ins).attr("id") ] = row;

					});
					
					storeData['data'] = matchData;
					storeData['updatedAt'] = currentTime;
					storeData = JSON.stringify(storeData);
					fs.writeFile(file, storeData, function(err){
						storeData = JSON.parse(storeData);
						res.send({data: storeData.data});
					});
					
				});
	},
	rendermatchData : function(res, matchData){
		var storeData = matchData;
		var teams = {};
		if (storeData.data.team1 != undefined && storeData.data.team2 != undefined) {
			teams[storeData.data.team1.id] = storeData.data.team1;
			teams[storeData.data.team2.id] = storeData.data.team2;
		}
		
		var players = {};
		if (storeData.data.players != undefined) {
			for(var p of storeData.data.players) {
				players[p.id] = p;
			}
		}
		var lastOver = [];
		if (storeData.data.score != undefined && storeData.data.score.prev_overs != undefined) {
			var lOver = storeData.data.score.prev_overs;
			lOver = lOver.trim();
			var lOverArr = lOver.split(" ");
			for(var o of lOverArr) {
				if (o == '|') {
					lastOver.push( "<span class='devider'>"+o+"</span>" );	
				} else {
					lastOver.push( "<span data-content='"+o+"'>"+o+"</span>" );	
				}
			}
			
		}
		//res.render("match-details", {data:storeData.data, teams : teams, players: players, lastOver: lastOver});
		res.send({data:storeData.data, teams : teams, players: players, lastOver: lastOver});
	},


	renderSeries : function(req, res) {
		const url = 'http://www.cricbuzz.com/cricket-schedule/series';
		request(url, function(error, response, html){
			var $ = cheerio.load(html);
			var result = [];
			$(".cb-mnth").each(function(i,e){

				var row = {};
				var seriesMonth = new Date( "01 "+ $(e).text());
				seriesMonth = seriesMonth.setDate(seriesMonth.getDate() + 1);
				row.month = moment(seriesMonth);
				row.series = [];
				$(e).parent().find('.cb-sch-lst-itm').each(function(itemIndex, item){
					var id = $(item).find('a').attr('href');
					var idArr = id.split("/");

					row.series.push({
						id : idArr[2],
						slug : idArr[3],
						name : $(item).find('a').text(),
						date : $(item).find('.text-gray').text(),
					});
				});
				result.push(row);
				
			});
			res.render('series-list',{data:result, moment : moment});
		});
	},
	renderSerieDetails : function(req, res) {
		const url = 'http://m.cricbuzz.com/cricket-series/'+req.params.id+'/'+req.params.slug+'/matches';
		request(url, function(error, response, html){
			var result = {};
			var $ = cheerio.load(html);
			result.name = $(".cb-page-header").text().trim();
			result.matches = [];
			$(".cb-list-main-header").each(function(i,e){
				const matchDetails = $(e).next();
				$(matchDetails).find('.cb-match-list-group-item').each(function(mIndex, mItem){
					const link = $(mItem).attr('href');
					const linkArr = link.split('/');
					var row = {
						id : linkArr[2],
						slug : linkArr[3],
						date : $(e).text().trim(),
						name : $(mItem).find('.list-group-item-heading').text().trim(),
						details : ($(mItem).find(".list-group-item-text").length > 0) ?  $(mItem).find(".list-group-item-text").first().text().trim() : '',
						details : ($(mItem).find(".list-group-item-text").length > 0) ?  $(mItem).find(".list-group-item-text").last().text().trim() : '',

					};
					result.matches.push(row);	
				})
				
			})
			res.send({ result: result });

		});
	},

	randerRanking : function(req, res) {
		if (req.params.type == 'team' ) {
			const url = "http://www.espncricinfo.com/rankings/content/page/211271.html";
			request(url, function(error, response, html){
				var result = {};
				result.type = req.params.type;
				var $ = cheerio.load(html);
				var headings =[];
				result.ranks = [];
				$(".ciPhotoContainer").find('h3').each(function(i, rankHeading){
					headings.push( $(rankHeading).text().trim() );
				})
				$(".StoryengineTable").each(function(i, rank){
					var row = {};
					row.heading = headings[i];
					row.ranks = [];
					$(rank).find('tbody').find('tr').each(function(rankIndex, rankDataTr){
						if(rankIndex != 0) {
							var rData = {};
							$(rankDataTr).find('td').each(function(rI, rankData){
								if(rI == 0) {
									rData.team = $(rankData).text().trim();
								}
								else if(rI == 1) {
									rData.matches = $(rankData).text().trim();
								}
								else if(rI == 2) {
									rData.points = $(rankData).text().trim();
								}
								else if(rI == 3) {
									rData.rating = $(rankData).text().trim();
								}
							})
							row.ranks.push(rData);
						}
					});
					result.ranks.push(row);
				})
				res.send({ data: result });
				//res.send(result);
			});
		} else if (req.params.type == 'players' ) {

			const domain = 'http://www.relianceiccrankings.com/feed/';
			const url = domain+req.params.matchType+'/'+req.params.position+'/';
			request(url, function(error, response, html){
				var $ = cheerio.load(html);
				var result = {};
				result.type = req.params.type;
				result.heading = req.params.matchType+' '+req.params.position+' Ranking';
				result.ranks = [];
				$(".ratingstable").find("tr.rankings").each(function(i,element){
					var row = {};
					row.rank = $(element).find(".menuteam").text();
					row.name = $(element).find(".menuteam-feed").text();
					row.country = $(element).find(".tdpadr").first().text();
					row.point = $(element).find(".tdpadr").last().text();
					result.ranks.push(row);
				});
				res.send({ data: result });
				//res.send(result);
			});
		}
		
	},

	renderNews : function(req, res)
	{
		const url = 'https://newsapi.org/v2/everything?sources=espn-cric-info&apiKey=3d633c0b1fa9483d94f722b8498f0840';
		const currentTime = moment().format("YYYY-MM-DD HH:mm:ss");
		const file = "public/cric/news.json";
		var diff = null;
		if (fs.existsSync(file)) {
			fs.readFile(file, 'utf8', function (err, newsData){
				if (newsData) {
					newsData = JSON.parse(newsData);
					var updateTime = newsData.updatedAt;
					diff = moment.duration(moment(currentTime).diff(moment(updateTime)));
				}
				
				if (diff === null || diff.asMinutes() > 30) {
					request(url, function(error, response, news){
						var storeData ={};
						storeData['data'] = JSON.parse(news);
						storeData['updatedAt'] = currentTime;
						storeData = JSON.stringify(storeData);
						fs.writeFile(file, storeData, function(err){
							storeData = JSON.parse(storeData);
							//res.send(storeData.data);
							res.send({data:storeData.data});
						});
						
					});
				} else {
					res.send({data:newsData.data});
				}
			})
		}
	},

	notAccess : function(req, res) {
		res.send("Not accessable");
	}

}
module.exports =  DataController;