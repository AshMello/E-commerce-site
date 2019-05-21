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
 app.post('/admin-login', (req,res) => {

  let username = req.body.username
  let password = req.body.password

  models.User.findOne({
    where: {
      username: username
    }
  }).then(function(user) {
    if (user === null) {
      res.render("admin-login", {message: "Invalid username or password!"})
    }
      else {
        bcrypt.compare(password, user.password,(error,result) => {
          if (result) {
            if (req.session){
              req.session.user = user.dataValues
          }
          res.redirect('/admin-inventory')
        } else {
          res.render("admin-login", {message: "Invalid username or password!"})
        }
      })
    }
  })
})


// admin logout
app.post('/admin-logout', function(req, res, next) {
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






//render mustache pages

app.get('/', (req, res) => {
  res.redirect('/main')
})

app.get('/main', (req, res) => {
  res.render('main')
})

app.get('/products', (req, res) => {
  res.render('products')
})

app.get('/about', (req, res) => {
  res.render('about')
})

app.get('/reviews', (req, res) => {
  res.render('reviews')
})

app.get('/contact', (req, res) => {
  res.render('contact')
})

app.get('/admin-login', (req, res) => {
  res.render('admin-login')
})

app.get('/admin-inventory', (req, res) => {
  res.render('admin-inventory')
})


app.listen(PORT, function() {
  console.log("Server is running...")
})
