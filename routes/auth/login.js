const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

router.post('/', (req, res, next) => {

	passport.authenticate('client-local-login', {session: false}, (err, user) => {
        
    if (err) {
    	return next(err);
    }
    
    req.logIn(user, {session: false}, function(err) {
      if (err) {
        return next({
          status: 500,
          message: "Problem with logging in"
        })
      }

      const authTokenObject = {
        uid: user._id
      }

      const authToken = jwt.sign(authTokenObject, 'miniUrl', {expiresIn: '1d'});

      res.status(200).json({
        authToken: authToken,
        user: user
      });

    });

  })(req, res, next);

});




module.exports = router;