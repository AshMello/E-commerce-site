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
const checkCart = require('./routes/cartMiddleware')
const products = require('./routes/products')
const PORT = 8080 //process.env.PORT
const axios = require('axios')
const adminInventory = require('./routes/admin-inventory.js')
const VIEWS_PATH = path.join(__dirname, '/views');
const cart = require('./routes/cart.js')
const checkout = require('./routes/checkout.js')

let session = require('express-session')

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))


app.all('/admin/*', authenticate)
app.all('/*', checkCart)
app.use('/', adminCred)
app.use('/', products)
app.use('/', adminInventory)
app.use('/', cart)
app.use('/', checkout)


app.use(express.static('public'))

app.use(bodyParser.urlencoded({ extended: false }))
app.engine('mustache', mustacheExpress(VIEWS_PATH + '/partials', '.mustache'))
app.set('views', './views')
app.set('view engine', 'mustache')


//render mustache pages

app.get('/', (req, res) => {
  res.redirect('/main')
})

app.get('/admin/updatechoice', (req, res) => {
  res.render('updatechoice')
})

app.get('/main', (req, res) => {
  res.render('main', {totalItems: req.session.cart.length})
})

app.get('/about', (req, res) => {
  res.render('about', {totalItems: req.session.cart.length})
})

app.get('/press', (req, res) => {
  res.render('press', {totalItems: req.session.cart.length})
})

app.get('/contact', (req, res) => {
  res.render('contact', {totalItems: req.session.cart.length})
})

app.get('/checkout', (req, res) => {
  res.render('checkout')
})

app.get('/contacts', (req, res) => {
  res.render('contacts')
})

app.listen(PORT, function() {
  console.log("Server is running...")
})
