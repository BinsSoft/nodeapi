var DB = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    authdb: (process.env.DB_AUTH_DATABASE || null),
    username: (process.env.DB_USER || null),
    password: (process.env.DB_PASSWORD || null),

    connection: function(dataBaseName) {

        if (process.env.DB_DRIVER && process.env.DB_DRIVER == 'mongo') {
            global.mongoose.Promise = global.Promise;
            var mongoConnectStr = "mongodb+srv://";
            if (DB.username != null) {
                mongoConnectStr += DB.username;
            }
            if (DB.password != null) {
                mongoConnectStr += ":" + DB.password + "@";
            }
            mongoConnectStr += DB.host;
            if (DB.port) {
                mongoConnectStr += ":" + DB.port;
            }
            mongoConnectStr += "/" + DB.database;
            // mongoConnectStr += DB.host + ":" + DB.port + "/" + DB.database;
            if (DB.authdb != null) {
                mongoConnectStr += '?authSource=' + DB.authdb;
            }
            mongoConnectStr += '?retryWrites=true&w=majority';
            console.log(mongoConnectStr);
            global.mongoose.connect(mongoConnectStr, (err) => {
                console.log("3) Mongo db server starts")
            });
        }

    },

};
DB.connection();
module.exports = DB;