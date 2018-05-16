var Controller = {};
const filePath  = './controllers';
global.fs.readdirSync(filePath).forEach(file => {
	if (fs.lstatSync(filePath+"/"+file).isDirectory() ) {
		Controller[file]={};
		global.fs.readdirSync(filePath+"/"+file).forEach(subfile => {

			if (fs.lstatSync(filePath+"/"+file+"/"+subfile).isDirectory() ) {
				Controller[file][subfile]={};
				global.fs.readdirSync(filePath+"/"+file+"/"+subfile).forEach(subsubfile => {



					if (fs.lstatSync(filePath+"/"+file+"/"+subfile+"/"+subsubfile).isDirectory() ) {
						Controller[file][subfile][subsubfile]={};
						global.fs.readdirSync(filePath+"/"+file+"/"+subfile+"/"+subsubfile).forEach(subsubsubfile => {
								subsubsubfile = subsubsubfile.slice(0,-3);
								Controller[file][subfile][subsubfile][subsubsubfile] = require("."+filePath+"/"+file+"/"+subfile+"/"+subsubfile+"/"+subsubsubfile);
						});
					} else {
						subsubfile = subsubfile.slice(0,-3);
						Controller[file][subfile][subsubfile] = require("."+filePath+"/"+file+"/"+subfile+"/"+subsubfile);
					}
	
				})
			} else {
				subfile = subfile.slice(0,-3);
				Controller[file][subfile] = require("."+filePath+"/"+file+"/"+subfile);
			}
			
		})
	} else {
		file = file.slice(0,-3);
		Controller[file] = require("."+filePath+"/"+file);	
	}
	
})
module.exports =  Controller;