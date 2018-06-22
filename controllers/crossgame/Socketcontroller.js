module.exports = {
	index : (socket) => {
		socket.on('players', function(data){
			if (data) {
				io.sockets.emit("game-players",data);
			}

		});
	}
}