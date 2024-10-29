require('dotenv').config()

const express = require('express')
const app = express()

app.use(express.json())

const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY)

const storeItems = new Map([
    [1, { priceInCents: 10000, name: 'Learn React Today'}],
    [2, { priceInCents: 12000, name: 'Build a Node.js API'}],
])

app.listen(3000)