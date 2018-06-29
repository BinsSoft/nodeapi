module.exports = {
	index : (socket) => {
		socket.on('players', function(data){
			if (data) {
				io.sockets.emit("game-players",data);
				socket.join(data.gameId);
			}

		});
		socket.on('players-result', function(data){
			if (data) {
				io.sockets.in(data.gameId).emit("game-players-result",data);
			}

		});
		socket.on("toss-emmit", (data)=>{
			if (data) {
				console.log(data);
				io.sockets.emit("toss-emmit-result",data);
			}			
		});
	}
}