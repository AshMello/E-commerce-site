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
const products = require('./routes/products')
const PORT = 8080 //process.env.PORT
const axios = require('axios')

const VIEWS_PATH = path.join(__dirname, '/views');

let session = require('express-session')

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))


app.all('/admin/*', authenticate)
app.use('/', adminCred)
app.use('/', products)


app.use(express.static('public'))

app.use(bodyParser.urlencoded({ extended: false }))
app.engine('mustache', mustacheExpress(VIEWS_PATH + '/partials', '.mustache'))
app.set('views', './views')
app.set('view engine', 'mustache')


//posting inventory to db
app.post('/admin/admin-inventory', (req, res) => {
  let thumbnail = req.body.image
  let name = req.body.name
  let category = req.body.selectType
  let style = req.body.selectGenre
  let description = req.body.description
  let price = req.body.price

  let item = models.Product.build({
    thumbnail: thumbnail,
    name: name,
    category: category,
    style: style,
    description: description,
    price: price
  })
  item.save().then((savedItem) => {
  }).catch(function(err) {
  }).then(function(){
    res.redirect('/admin/admin-inventory')
  })
})

//View all from db
app.post('/admin/admin-viewall', (req,res) => {
  models.Product.findAll().then(product => {
    res.render('admin-inventory', {product: product})
  })
})

//View category from db
app.post('/admin/admin-viewfiltered', (req,res) => {
  models.Product.findAll({
    where: {
      category: req.body.selectCat}
  }).then(product => {
    res.render('admin-inventory', {product: product})
  })
})

//admin selects product to update
app.get('/admin/editproduct/:id', (req,res)=> {
  models.Product.findOne({
      where: {
        id : req.params.id
      }
    }).then((product) => {
      res.render('updatechoice', {product: product})
    })
  })

//admin updates product
app.post('/admin/updatechoice',(req,res)=>{
  let thumbnail = req.body.image
  let name = req.body.name
  let category = req.body.selectType
  let style = req.body.selectGenre
  let description = req.body.description
  let price = req.body.price

  models.Product.update({
      thumbnail: thumbnail,
      name: name,
      category: category,
      style: style,
      description: description,
      price: price
    },{
      where: {
        id: req.body.id
      }
    })
    res.redirect('/admin/admin-inventory')
})

//admin deletes product
app.post('/admin/deleteproduct',(req,res)=>{
  models.Product.destroy({
      where: {
        id : req.body.productId
      }
    })
    res.redirect('/admin/admin-inventory')
})

//render mustache pages

app.get('/', (req, res) => {
  res.redirect('/main')
})

app.get('/admin/updatechoice', (req, res) => {
  res.render('updatechoice')
})

app.get('/main', (req, res) => {
  res.render('main')
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
