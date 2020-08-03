var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
var validator = require('express-validator');
var session = require('express-session');
// var flash = require('express-flash');
var mongoose = require('mongoose');
let debug = require('debug')('app');
var logger = require('morgan');
const MongoStore = require('connect-mongo')(session);

// var MongoDBStore = require('connect-mongodb-session')(session);
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('./models/user');

const MONGODB_URI = 'mongodb://localhost/Volunteer_App';


  let secret = 'supersecret'


  // const store = new MongoDBStore({
  //   uri: MONGODB_URI,
  //   collection: 'sessions'
  // });
  
var app = express();


 mongoose.connect(MONGODB_URI)
const sessionStore = new MongoStore({collection:'sssession', mongooseConnection: mongoose.connection})




mongoose.connection.on('connected', function(test) {
  console.log("connected to mongoose")

});
mongoose.connection.on('error', function() {
	console.log('There is an issue with your MongoDB connection.  Please make sure MongoDB is running.');
	process.exit(1);
});

app.use(logger('dev'));
app.use(bodyParser.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



passport.use(new LocalStrategy(
  function(username, password, cb) {
    let loadedUser;
      User.findOne({ username: username })
          .then((user) => {
              if (!user) { return cb(null, false) }
              
              
              loadedUser = user;
              return bcrypt.compare(password, user.password);
          }).then(isEqual => {
            if (!isEqual) {
              console.log('not AUTH')
              return cb(null, false); 
            }
            else{
              console.log('yes, I am auth')
    
              return cb(null, loadedUser);
            }
            
      
          })
          .catch((err) => {   
              cb(err);
          });
}));

/**
* This function is used in conjunction with the `passport.authenticate()` method.  See comments in
* `passport.use()` above ^^ for explanation
*/
passport.serializeUser(function(user, cb) {
  console.log('in serializeUser function')

  console.log(user)
  cb(null, user.id);
});
/**
* This function is used in conjunction with the `app.use(passport.session())` middleware defined below.
* Scroll down and read the comments in the PASSPORT AUTHENTICATION section to learn how this works.
* 
* In summary, this method is "set" on the passport object and is passed the user ID stored in the `req.session.passport`
* object later on.
*/
passport.deserializeUser(function(id, cb) {
  console.log('in deserializeUser fun')
  User.findById(id, function (err, user) {
      console.log('deser')
       console.log(user)
      if (err) { return cb(err); }
      cb(null, user);
  });
});


app.cookieParser = cookieParser(secret);
app.use(app.cookieParser);
app.use(session({

	resave: false,
	saveUninitialized: false,
  secret: secret,
  rolling: true,
	store: sessionStore,
	cookie: {
    
    httpOnly: true,
    maxAge: 3600000,
    
	}
}));



// passport needs to come after session initialization
app.use(passport.initialize());
app.use(passport.session());





app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization', 'X-Requested-With', 'Origin', 'Accept');
  next();
});


var usersRoute = require('./routes/users');
app.use('/users', usersRoute)



//fot test only
app.get('/protected-route',passport.authenticate('local') ,(req, res, next) => {

  console.log(req.session);
  if (req.isAuthenticated()) {
      res.send('<h1>You are authenticated</h1>');
  } else {
      res.send('<h1>You are not authenticated</h1>');
  }

});


//route for test 
app.post('/protected-route', (req, res, next) => {


  //only test
  console.log(req.session);
  if (req.isAuthenticated()) {
    console.log('saba')
      res.send('<h1>You are authenticated</h1>');
  } else {
    console.log('not saba')
      res.send('<h1>You are not authenticated</h1>');
  }
});



app.get('/logout', async(req, res)=>{
  req.session.destroy((err) => {
   
  });
  
})


// error handler
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

module.exports = app;
