const BCRYPT = {
	'saltRounds' : 10,
	'myPlaintextPassword' : 's0/\/\P4$$w0rD',
	init : function() {
		return require('bcrypt');
	}
};
module.exports  = BCRYPT;