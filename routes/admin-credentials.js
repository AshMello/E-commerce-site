const express = require('express')
const mustacheExpress = require('mustache-express')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const saltRounds = 10
const sequelize = require('sequelize')
const models = require('../models')
const router = express.Router()

let session = require('express-session')

router.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))

router.use(bodyParser.urlencoded({ extended: false }))

 // Logging into the app and checking the username and password to the database
 router.post('/admin-login', (req,res) => {
  let username = req.body.username

  models.User.findOne({
    where: {
      username: username
    }
  }).then(function(user) {
    bcrypt.compare(req.body.password, user.password, function(err, data) {
    if (data) {
      if(req.session) {
        req.session.user = username
        res.redirect('/admin/admin-inventory')
      }
      } else {
          res.render("admin-login", {message: "Invalid username or password!"})
      }
    })
  })
})

router.get('/admin-login', (req,res) => {
  if (req.session) {
    if(req.session.user) {
      res.redirect('/admin/admin-inventory')
    } else {
      res.render('admin-login')
    }
  } else {
    res.render('admin-login')
  }
})

// admin logout
router.post('/admin/admin-logout', function(req, res, next) {
  if (req.session) {
    req.session.destroy(function(err) {
      if(err) {
        return next(err);
      } else {
        res.redirect('/admin-login');
      }
    });
  }
 })

// render inventory page
 router.get('/admin/admin-inventory', (req, res) => {
   res.render('admin-inventory')
 })

module.exports = router
