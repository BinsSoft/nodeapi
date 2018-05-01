var Systems = {};
const filePath  = './systems'
global.fs.readdirSync(filePath).forEach(file => {
	file = file.slice(0,-3);
	Systems[file] = require(filePath+"/"+file);
})
module.exports =  Systems;