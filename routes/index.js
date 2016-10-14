/**
 * Module dependencies
 */
var express = require('express'),
	passport = require('passport'),
  studyController = require('../controllers/study'),
  categoryController = require('../controllers/category');

/**
 * the new Router exposed in express 4
 * the indexRouter handles all requests to the `/` path
 */
var indexRouter = express.Router();


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()){
      return next();    
    }
    res.redirect('/');
}

indexRouter.route('/').get(function(req, res){
  res.redirect('/home');
});

indexRouter.route('/home').get(function(req, res){
  var err = req.flash('errMessage');
  if(err.length === 0) {
    res.render('index', {});
  } else {
    res.json({'success':false, 'error': err[0]});
  }  
});

indexRouter.route('/experimenter').get(isLoggedIn, function(req, res){
  res.render('experimenter/index', {
    user : req.user
  });
});

indexRouter.route('/login').post(passport.authenticate('local-login', {failureRedirect: '/home', failureFlash: true}), function(req, res){
  if(req.user) {
    res.status(200).send({'success':true, 'user': req.user});
  } else {
    res.status(401).send({'success': false});
  }
});

indexRouter.route('/signup').post(passport.authenticate('local-signup', {failureRedirect: '/home', failureFlash: true}), function(req, res){
  if(req.user) {    
    res.status(200).send({'success':true, 'user': req.user});
  } else {
    res.status(401).send({'success': false});
  }
});

indexRouter.route('/user/login').post(passport.authenticate('user-login', {failureRedirect: '/home', failureFlash: true}), function(req, res){    
  if(req.user) {
    res.status(200).send({'success':true, 'user': req.user});
  } else {
    res.status(401).send({'success': false});
  }
});

indexRouter.route('/user/signup').post(passport.authenticate('user-signup', {failureRedirect: '/home', failureFlash: true}), function(req, res){
  if(req.user) {    
    res.status(200).send({'success':true, 'user': req.user});
  } else {
    res.status(401).send({'success': false});
  }
});

indexRouter.route('/logout').get(function(req, res) {
  req.logout();
  res.redirect('/');
});

indexRouter.route('/api/experimenter/studies/list').post(studyController.getAll);
indexRouter.route('/api/experimenter/studies/add').post(studyController.add);
indexRouter.route('/api/category/add').post(categoryController.add);
indexRouter.route('/api/category/list').post(categoryController.getAll);

exports.indexRouter = indexRouter;
