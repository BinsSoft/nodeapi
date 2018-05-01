var Routes = {};
const filePath  = './routes'
global.fs.readdirSync(filePath).forEach(file => {
	file = file.slice(0,-3);
	Routes[file] = require("."+filePath+"/"+file);
	global.app.use(Routes[file]);
})

module.exports = Routes;