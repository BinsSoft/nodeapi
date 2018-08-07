const api = {
	key : '77d5a352398092afa57ceb6fc880623d',
	url : 'http://api.openweathermap.org/data/2.5/'
}
var request 		= require('request');
const Helper = {
    _content(field,type=''){
        url_type = '';
        switch(type){
            case "forecast":
                url_type = 'forecast';
                break;
            default:
                url_type = 'weather';
                break;
        }
        let field_data = '';
        field_data = 'appid='+api.key+'&';
        for(let f in field) {
            field_data += f+'='+field[f]+'&';
        }
        
        
        const url = api.url+url_type+'?'+field_data;
        return new Promise((resolve, reject)=>{
            request(url, function(error, response){
                let data = JSON.parse(response.body);
                resolve(data);
            });
            
        })
        
        
    },

    _temperature(temp,type='c'){
        if(temp){
            let temperature = temp;
            switch(type){
                case "c":
                    temperature = (temperature - 273.15);
                    break;
                case "f":
                    temperature = (temperature - 273.15); // c temp
                    temperature = (temperature * 9/5)+32;
                    break;
            }
            temperature = parseInt(temperature);
            return temperature;
        }
        return false;
    },
}
module.exports = {

    
    currentWeather(req, res)
    {
        const field = {
            'lat':req.body.lat,'lon':req.body.lng
        }
        let type=req.body.type;
        Helper._content(field,'weather').then((responseData)=>{
            if(responseData){
                responseData.main.temp = Helper._temperature(responseData.main.temp, type);
                responseData.main.temp_min = Helper._temperature(responseData.main.temp_min,type);
                responseData.main.temp_max = Helper._temperature(responseData.main.temp_max,type);
                if (responseData.sys.sunset > responseData.dt) {
                    responseData.iconDay = 'day';
                } else {
                    responseData.iconDay = 'night';
                }
                responseData.sys.sunrise = global.moment.unix(responseData.sys.sunrise).format('hh:mm a');
                responseData.sys.sunset = global.moment.unix(responseData.sys.sunset).format('hh:mm a');
                responseData.dt = global.moment.unix(responseData.dt).format('HH');
                
                if (responseData.wind && responseData.wind.deg) {
                    responseData.wind.dist = 'N';
                    if (responseData.wind.deg > 20 && responseData.wind.deg <= 70) {
                        responseData.wind.dist = 'NE';
                    } else if (responseData.wind.deg >= 71 && responseData.wind.deg <= 120) {
                        responseData.wind.dist = 'E';
                    } else if (responseData.wind.deg >= 121 && responseData.wind.deg <= 160) {
                        responseData.wind.dist = 'SE';
                    } else if (responseData.wind.deg >= 161 && responseData.wind.deg <= 210) {
                        responseData.wind.dist = 'S';
                    } else if (responseData.wind.deg >= 211 && responseData.wind.deg <= 255) {
                        responseData.wind.dist = 'SW';
                    } else if (responseData.wind.deg >= 256 && responseData.wind.deg <= 290) {
                        responseData.wind.dist = 'W';
                    } else if (responseData.wind.deg >= 291 && responseData.wind.deg <= 330) {
                        responseData.wind.dist = 'NW';
                    }

                }
            }
            res.send(responseData);
        });
    },

    forcastWeather(req, res) {
        const field = {
            'lat':req.body.lat,'lon':req.body.lng
        }
        let type=req.body.type;
        Helper._content(field,'forecast').then((responseData)=>{
            res.send(responseData);
        })
    }
};