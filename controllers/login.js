var ExperimenterSchema 	= require('../models/experimenter'),
    UserSchema      = require('../models/user'),
    jwt             = require('jwt-simple'),	
	LocalStrategy   = require('passport-local').Strategy;

module.exports = function(passport) {    
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        ExperimenterSchema.findById(id, function(err, user) {            
            done(err, user);
        });
    });

    passport.use('local-signup', new LocalStrategy({        
        usernameField : 'username',
        passwordField : 'password',        
        passReqToCallback : true
    },
    function(req, username, password, done) {
        process.nextTick(function() {

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        ExperimenterSchema.findOne({$or:[{'email' : req.body.email}, {'username' : username}]}, function(err, user) {
            // if there are any errors, return the error
            if (err){
                return done(err);
            }
            
            if (user) {
                var errTarget = '';
                if(user.username === username) {
                    errTarget = 'username';
                    return done(null, false, req.flash('errMessage', 'That ' + errTarget + ' is already taken'));
                }
                if(user.email === req.body.email) {
                    errTarget = 'email';
                    return done(null, false, req.flash('errMessage', 'That ' + errTarget + ' is already taken'));
                }
            } else {
                
                var newUser            = new ExperimenterSchema();                
                newUser.username    = username;                
                newUser.password    = newUser.generateHash(password);
                newUser.email       = req.body.email;
                newUser.affiliation = req.body.affiliation;
                newUser.firstName   = req.body.firstname;
                newUser.lastName    = req.body.lastname;
                newUser.phoneNumber = req.body.phonenumber;                
                
                newUser.save(function(err) {
                    if (err){
                        throw err;
                      }
                    return done(null, newUser);
                });
            }

        });    

        });

    }));

    passport.use('local-login', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) { // callback with email and password from our form

            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            ExperimenterSchema.findOne({ 'username' :  username }, function(err, user) {
                // if there are any errors, return the error before anything else
                if (err){
                  return done(err);
                }

                // if no user is found, return the message
                if (!user){
                  return done(null, false, req.flash('errMessage', 'No such user exists')); // req.flash is the way to set flashdata using connect-flash
                }

                // if the user is found but the password is wrong
                if (!user.validPassword(password)){
                  return done(null, false, req.flash('errMessage', 'Wrong password')); // create the loginMessage and save it to session as flashdata
                }
                
                user.lastLogin = Date.now();                
                user.save();

                return done(null, getToken(user));
            });

        }));

    passport.use('user-signup', new LocalStrategy({        
        usernameField : 'username',
        passwordField : 'password',        
        passReqToCallback : true
    },
    function(req, username, password, done) {
        process.nextTick(function() {

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        UserSchema.findOne({$or:[{'email':req.body.email},{'username': username}]}, function(err, user) {
            // if there are any errors, return the error            
            if (err){
                return done(err);
            }
            
            var errTarget = '';
                if(user.username === username) {
                    errTarget = 'username';
                    return done(null, false, req.flash('errMessage', 'That ' + errTarget + ' is already taken'));
                }
                if(user.email === req.body.email) {
                    errTarget = 'email';
                    return done(null, false, req.flash('errMessage', 'That ' + errTarget + ' is already taken'));
            } else {            
                var newUser            = new UserSchema();                
                newUser.username    = username;                
                newUser.password    = newUser.generateHash(password);
                newUser.email       = req.body.email;
                newUser.firstName   = req.body.firstname;
                newUser.lastName    = req.body.lastname;
                newUser.phoneNumber = req.body.phonenumber;                
                
                newUser.save(function(err) {
                    if (err){
                        throw err;
                      }
                    return done(null, newUser);
                });
            }

        });    

        });

    }));

    passport.use('user-login', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) { // callback with email and password from our form

            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            UserSchema.findOne({ 'username' :  username }, function(err, user) {
                // if there are any errors, return the error before anything else
                if (err){
                  return done(err);
                }

                // if no user is found, return the message
                if (!user){
                  return done(null, false, {'error': 'No such user exists'}); // req.flash is the way to set flashdata using connect-flash
                }

                // if the user is found but the password is wrong
                if (!user.validPassword(password)){
                  return done(null, false, {'error': 'Wrong password'}); // create the loginMessage and save it to session as flashdata
                }               

                user.lastLogin = Date.now();                
                user.save();

                return done(null, getToken(user));
            });

    }));

    function getToken(user) {
        var expires = expiresIn(7);
        var token = jwt.encode({
            exp: expires
        }, 'Atoole65!');

        return {
            'id': user._id,
            'token': token,
            'lastLogin': user.lastLogin,
            'username': user.username
        };
    }

    function expiresIn(n) {
        var d = new Date();
        return d.setDate(d.getDate() + n);
    }
};