const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const debug = require('debug')('app:passport-local-auth');
const User = require('./model')('User');

function initialize(passport) {
  const authenticateUser = async (email, password, done) => {
    const user = await User.findOne({email: email});
    if (user == null) {
      return done(null, false, { message: 'No user with that email' })
    }

    try {
      debug(`user is: ${user}`);
      debug(`password is: ${password} and user.password is: ${user.password}`);
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user)
      } else {
        return done(null, false, { message: 'Password incorrect' })
      }
    } catch (e) {
      return done(e)
    }
  }

  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
  passport.serializeUser((user, done) => done(null, user._id))
  passport.deserializeUser(async (id, done) => {
    let user = await User.findOne({_id: id}).exec();
    return done(null, user)
  })
}

module.exports = initialize
