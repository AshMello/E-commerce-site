const express = require('express')
const mustacheExpress = require('mustache-express')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const saltRounds = 10
const sequelize = require('sequelize')
const models = require('./models')
const path = require('path')
const app = express()
const adminCred = require('./routes/admin-credentials')
const authenticate = require('./routes/admin-authenticate')
const PORT = 8080 //process.env.PORT

const VIEWS_PATH = path.join(__dirname, '/views');

let session = require('express-session')

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))

app.all('/admin/*', authenticate)
app.use('/', adminCred)

app.use(bodyParser.urlencoded({ extended: false }))
app.engine('mustache', mustacheExpress(VIEWS_PATH + '/partials', '.mustache'))
app.set('views', './views')
app.set('view engine', 'mustache')

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

app.listen(PORT, function() {
  console.log("Server is running...")
})
