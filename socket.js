const Server = require('socket.io');
const debug = require('debug')('app:socket');
const User = require('./model')('User');
const dateformat = require('dateformat');

module.exports = (server, { passInit, passSession, sessionMiddleware }) => {
	const io = new Server(server, { cookie: false });
	io.use((socket, next) => { sessionMiddleware(socket.request, socket.request.res || {}, next); });
	io.use((socket, next) => { passInit(socket.request, socket.request.res || {}, next); });
	io.use((socket, next) => { passSession(socket.request, socket.request.res || {}, next); });

	io.set('authorization', (data, accept) => {
		var auth = data.isAuthenticated();
		debug(`is auth? ${auth}`);
		if (auth) {
			debug('hi');
			return accept(null, true);
		}
		else 
			accept(null, false);
	});
	  
	io.on('connection', socket => {
		socket.on('message', async (data) => {
			let user = data.user;
			let message = data.message;
			let msgDate = dateformat(new Date(), 'h:MM:ss TT');
			let dataToSend = {user: user.name, message, msgDate, key: new Date()};
			debug(dataToSend, 'was sent');
			socket.emit('broad', dataToSend);
		});
	});

}
