var Controller = {};
const filePath  = './controllers'
global.fs.readdirSync(filePath).forEach(file => {
	file = file.slice(0,-3);
	Controller[file] = require("."+filePath+"/"+file);
})
module.exports =  Controller;