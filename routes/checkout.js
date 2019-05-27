const express = require('express')
const mustacheExpress = require('mustache-express')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const saltRounds = 10
const sequelize = require('sequelize')
const models = require('../models')
const router = express.Router()
const stripe = require('stripe')('sk_test_FQbrqIv7QNIERfJv3watoOv800WshdaZhC');

// Token is created using Checkout or Elements!
// Get the payment token ID submitted by the form:
router.post('/charge', (req, res) => {
let token = req.body.stripeToken; // Using Express

(async () => {
  const charge = await stripe.charges.create({
    amount: 999,
    currency: 'usd',
    description: 'Example charge',
    source: token,
  });
})();
  res.redirect('/products')
})




module.exports = router;

