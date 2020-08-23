var debug = require('debug')('app:index')
var express = require('express')
var session = require('express-session')
var MongoStore = require('connect-mongo')(session)
var Server = require('socket.io')
var init = require('./passport-config')
var passport = require('passport')
var app = express()
var httpServer = require('http').createServer(app)
var cors = require('cors');

var corsMiddleware = cors({ origin: "http://localhost:3000", credentials: true });
app.use(corsMiddleware);

var sessionMiddleware = session({
	key: 'a_key',
	secret: 'a string',
	saveUninitialized: false,
	resave: true,
	store: new MongoStore({ url: 'mongodb://localhost/Volunteer_App' }),
	cookie: {
		maxAge: 86400000, 
		rolling: true
	}
});
var passInit = passport.initialize();
var passSession = passport.session();

init(passport);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(sessionMiddleware, passInit, passSession);

var io = new Server(httpServer, { cookie: false });

io.use((socket, next) => { sessionMiddleware(socket.request, socket.request.res || {}, next); });
io.use((socket, next) => { passInit(socket.request, {}, next); });
io.use((socket, next) => { passSession(socket.request, {}, next); });

io.set('authorization', (data, accept) => {
	var user = data.session.passport && data.session.passport.user;
	debug('the headers are: ', data.headers);
	debug('authen: ', data.isAuthenticated());
	debug(user);
	accept(null, true);
})

io.on('connection', (socket) => { debug(socket.request.session); debug('New connection'); });

app.use('/', require('./routes/index.js'));
app.use('/users', require('./routes/users'));

httpServer.listen(8080, () => debug(`Listening on port 8080`));
