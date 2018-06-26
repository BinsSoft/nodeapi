module.exports = {
	index : (socket) => {
		socket.on('players', function(data){
			if (data) {
				io.sockets.emit("game-players",data);
			}

		});
		socket.on('players-result', function(data){
			if (data) {
				io.sockets.emit("game-players-result",data);
			}

		});
		
	}
}