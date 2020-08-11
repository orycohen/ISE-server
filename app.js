const cookieParser = require('cookie-parser')
const mongo = require('mongoose')
const debug = require('debug')('app:index')
const express = require('express')
const bcrypt = require('bcrypt')
const passport = require('passport')
const session = require('express-session')
const methodOverride = require('method-override')
const User = require('./model')('User')
const connectMongo = require('connect-mongo');
const cors = require('cors');

const app = express();

(async () => {
    let MongoStore = connectMongo(session);
    let sessionConnection = mongo.createConnection();

    try {
        await sessionConnection.openUri(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true});
    } catch (error) {
        debug(`Cannot connect to session DB. Error: ${error}`);
        process.exit(-1);
    }

    const initializePassport = require('./passport-config');
    initializePassport(passport);

    app.set('view-engine', 'ejs');
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cors({
        origin: "http://localhost:3000",
        credentials: true
    }));

    const secret = process.env.SESSION_SECRET;
    app.use(cookieParser(secret));

    app.use(session({
        name: 'users.sid.test',
        secret: secret,
        resave: false,
        saveUninitialized: false,
        resave: true,
        store: new MongoStore({mongooseConnection: sessionConnection}),
        cookie: {maxAge: 86400000/*It's a day*/, httpOnly: true, sameSite: true}
    }));
    app.use((req, res, next) => {debug(`The requested url is: ${req.originalUrl}`); next();});

    app.use(passport.initialize());
    app.use(passport.session());

    app.use('/users', require('./routes/users'));
    //app.use(express.static(require('path').join(__dirname, 'public', 'appBuild')));
    //app.get('/*', (req, res) => {
      //let path = require('path');
      //res.sendFile(path.resolve(path.join(__dirname, 'public', 'appBuild', 'index.html')));
    //});
})().catch(err => debug(`Failure: ${err}`));

module.exports = app
