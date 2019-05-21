const express = require('express')
const mustacheExpress = require('mustache-express')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const saltRounds = 10
const sequelize = require('sequelize')
const models = require('./models')
const path = require('path')
const app = express()
const PORT = 8080 //process.env.PORT

const VIEWS_PATH = path.join(__dirname, '/views');

let session = require('express-session')

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))

// app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }))
app.engine('mustache', mustacheExpress(VIEWS_PATH + '/partials', '.mustache'))
app.set('views', './views')
app.set('view engine', 'mustache')

function isAuthenticated(req,res,next) {
  if (req.session.user) {
    next()
  }
  else {
    res.redirect('/')
  }
}

 // Logging into the app and checking the username and password to the database
 app.post('/login', (req,res) => {

  let username = req.body.username
  let password = req.body.password

  models.User.findOne({
    where: {
      username: username
    }
  }).then(function(user) {
    if (user === null) {
      res.render("login", {message: "Invalid username or password!"})
    }
      else {
        bcrypt.compare(password, user.password,(error,result) => {
          if (result) {
            if (req.session){
              req.session.user = user.dataValues
          }
          res.redirect('/home')
        } else {
          res.render("login", {message: "Invalid username or password!"})
        }
      })
    }
  })
})


// admin logout 
app.post('/logout', function(req, res, next) {
  if (req.session) {
    req.session.destroy(function(err) {
      if(err) {
        return next(err);
      } else {
        res.redirect('/login');
      }
    });
  }
 })

   // Showing the logout page
 app.get('/logout',(req,res) =>{
  res.render('logout')
 })


// let password = "admin"
// bcrypt.hash(password, saltRounds, function(err,hash) {

//   models.User.create({
//     username: "admin",
//     password: hash,
//   }).then(user => {
//     console.log(user) // ... in order to get the array of user objects
//   })
// })






app.listen(PORT, function() {
  console.log("Server is running...")
})
