const Server = require('socket.io');
const debug = require('debug')('app:socket');

module.exports = (server, { passportInit, passportSession, sessionMiddleware, corsMiddleware }) => {
	const io = new Server(server, { cookie: false });
	io.origins('*:*');
	io.use((socket, next) => { sessionMiddleware(socket.request, socket.request.res || {}, next); });
	io.use((socket, next) => { passportInit(socket.request, {}, next); });
	io.use((socket, next) => { passportSession(socket.request, {}, next); });

	io.set('authorization', (data, accept) => {
		var auth = data.isAuthenticated();
		debug(`is auth? ${auth}`);
		if (!auth) {
			return accept(null, false);
		}
		else {
			return accept(null, true);
		}
	});
	  
	io.on('connection', socket => {
		debug(JSON.stringify(socket.emit));
		socket.emit('msg', { message: "I am very much alive!"});
	});
}
