var Config = {};
const filePath  = './config'
global.fs.readdirSync(filePath).forEach(file => {
	file = file.slice(0,-3);
	Config[file] = require("."+filePath+"/"+file);
})
module.exports =  Config;