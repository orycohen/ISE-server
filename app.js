const cookieParser = require('cookie-parser')
const mongo = require('mongoose')
const debug = require('debug')('app:index')
const express = require('express')
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const User = require('./model')('User')
const connectMongo = require('connect-mongo');

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

    const initializePassport = require('./passport-config')
    initializePassport(passport)

    app.set('view-engine', 'ejs')
    app.use(express.json())
    app.use(express.urlencoded({ extended: false }))

    const secret = process.env.SESSION_SECRET
    app.use(cookieParser(secret));

    app.use(flash())
    app.use(session({
        name: 'users.sid.test',
        secret: secret,
        resave: false,
        saveUninitialized: false,
        resave: true,
        store: new MongoStore({mongooseConnection: sessionConnection}),
        cookie: {maxAge: 900000, httpOnly: true, sameSite: true}
    }))

    app.use(passport.initialize())
    app.use(passport.session())
    app.use(methodOverride('_method'))

    //For development only!
    app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader( 'Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization', 'X-Requested-With', 'Origin', 'Accept');
        next();
    });
    //--------------------

    app.use('/users', require('./routes/users'));

})().catch(err => debug(`Failure: ${err}`));

module.exports = app
