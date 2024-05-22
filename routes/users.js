// routes/users.js

const { storeReturnTo, isLoggedIn } = require('../middleware');
const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const users = require('../controllers/users');
const multer = require('multer');
const {storage} = require('../cloudinary');
const upload = multer({ storage });


router.route('/register')
    .get((req, res) => {res.render('users/register');})
    .post( catchAsync( users.userRegister ));

router.route('/login')
    .get((req, res) => {res.render('users/login');})
    .post(storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: 'login' }), (req, res) => {
        res.redirect('/home')
    });

router.get('/logout', users.logout);

router.route('/lists')
    .get(isLoggedIn, catchAsync( users.getLists ))
    .post(isLoggedIn, catchAsync( users.addMovieToList))
    .delete(isLoggedIn, catchAsync( users.deleteMovieFromList ))
    .patch(isLoggedIn, catchAsync(users.changeList));

router.route('/lists/:id')
    .get(isLoggedIn, catchAsync(users.filterByList))
    .post(isLoggedIn, catchAsync(users.addNewList))
    .delete(isLoggedIn, catchAsync(users.deleteList));


const pepa = (req, res, next) => { 
    upload.single('userIMG')(req, res, ( ) => {
        console.log(process.env.cloud_name, process.env.api_key, process.env.api_secret)
        console.log(req.body)
        console.log('file')
        console.log(req.file)
    })
  
    next()
    }

router.route('/profile')
    .get( isLoggedIn, catchAsync( users.getProfile ))
    .post( isLoggedIn, pepa, catchAsync(users.uploadIMG));


module.exports = router;

