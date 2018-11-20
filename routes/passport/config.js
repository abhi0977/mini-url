const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportJwt = require('passport-jwt');
const ExtractJwt = passportJwt.ExtractJwt;
const JwtStrategy = passportJwt.Strategy;
const bcrypt = require('bcryptjs');
const hat = require('hat');
const User = require('./../../model/User');
console.log("Helelelelelel")

passport.use('client-local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  
  function(username, password, done) {
    console.log("LOIGIGNGIG")
    User.findOne({ email: username }, (err, user) => {
      console.log(user)
      // If db is not available (a server error message is passed into err)

      if (err) {
        return done({
          status: 500,
          message: 'Server error'
        })
      }

      // If there is no such user
      if (!user) {
        return done({
          status: 400,
          message: 'Incorrect username'
        });
      }

      bcrypt.compare(password, user.password, function(err, res) {

        // If the password does not match
        if(res === false){
          return done({
            status: 400,
            message: 'Incorrect password'
          });
        }

        // If password matches
        else {
          user.password = null;
          return done(null, user);
        }

      });      

    });
  }
));



passport.use(new JwtStrategy({

    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey   : 'miniUrl'

  },
  (jwtPayload, done) => {

    const userId = jwtPayload.uid;

    User.findById(userId, (err, client) => {

      if(err){
        return done({
          status: 500,
          message: "Server error"
        })
      }

      if(!client){
        return done({
          status: 400,
          message: "Invalid user"
        })
      }

      done(null, client);

    });

  }
));



passport.use('client-local-register', new LocalStrategy({

    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true // allows us to pass back the entire request to the callback

  },

  function(req, username, password, done) {

    User.findOne({ 'email' :  username }, function(err, user) {
        
      // If db is not available (a server error message is passed into err)
      if (err) {
        return done({
          status: 500,
          message: 'Server error'
        });
      }

      // Check to see if there is already a user with that email
      if (user) {
        return done({
          status: 400,
          message: 'User already exists'
        });
      }

      // If there is no user with that email
      else {

        // Create the user
        let newUser = new User();
        console.log(req.body)
        // Set the user's credentials
        newUser.email = username;
        newUser.name = req.body.name;
        newUser.level = req.body.level;

        bcrypt.genSalt(10, function(err, salt) {
          bcrypt.hash(password, salt, function(err, hash) {

            newUser.password = hash;

            // Save the user
            newUser.save(function(err) {
              if (err) {
                return done({
                  status: 500,
                  message: 'Server error' 
                });
              }

              return done(null, newUser);
            });

          });
        });

      }

    });

  }

));