const mongoose = require('mongoose')
const express = require('express')
const { dbURI, port } = require('./config/env')
const app = express()

mongoose.connect(dbURI, { useNewUrlParser: true })

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
  console.log('connected!')
})

app.listen(port, () => console.log(`App is totally listening on port ${port}`))
