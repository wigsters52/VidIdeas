const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')

const app = express()
// MAP global promise -- get rid of wraning
mongoose.Promise = global.Promise
// Connect to mongoose
mongoose.connect('mongodb://localhost/vididea-dev')
  .then(() => console.log('MongoDB connected!!'))
  .catch(err => console.log(err))

// Handlebars middlewar

app.engine('handlebars', exphbs(
  { defaultLayout: 'main' }
))
app.set('view engine', 'handlebars')

// index route

app.get('/', (req, res) => {
  const title = 'Welcome!'
  res.render('index', {
    title: title
  })
})

app.get('/about', (req, res) => {
  res.render('about')
})

const port = 5000

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
})
