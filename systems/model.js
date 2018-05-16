var Models = {};
const filePath  = './models';
global.fs.readdirSync(filePath).forEach(file => {
	if (fs.lstatSync(filePath+"/"+file).isDirectory() ) {
		Models[file]={};
		global.fs.readdirSync(filePath+"/"+file).forEach(subfile => {

			subfile = subfile.slice(0,-3);
			Models[file][subfile] = require("."+filePath+"/"+file+"/"+subfile);
			
		})
	} else {
		file = file.slice(0,-3);
		Models[file] = require("."+filePath+"/"+file);	
	}
	
})
module.exports =  Models;