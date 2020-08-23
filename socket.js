const Server = require('socket.io');
const debug = require('debug')('app:socket');

module.exports = (server, { passInit, passSession, sessionMiddleware }) => {
	const io = new Server(server, { cookie: false });
	io.use((socket, next) => { sessionMiddleware(socket.request, socket.request.res || {}, next); });
	io.use((socket, next) => { passInit(socket.request, {}, next); });
	io.use((socket, next) => { passSession(socket.request, {}, next); });

	io.set('authorization', (data, accept) => {
		var auth = data.isAuthenticated();
		debug(`is auth? ${auth}`);
		if (auth) 
			return accept(null, true);
		else 
			return accept(null, false);
	});
	  
	io.on('connection', socket => {
		socket.emit('msg', { message: "I am very much alive!"});
	});
}
