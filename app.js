const express = require('express')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const session = require('express-session')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const app = express()
// MAP global promise -- get rid of wraning
mongoose.Promise = global.Promise
// Connect to mongoose
mongoose.connect('mongodb://localhost/vididea-dev')
  .then(() => console.log('MongoDB connected!!'))
  .catch(err => console.log(err))
// Load Idea Model
require('./models/Idea')
const Idea = mongoose.model('ideas')
// Handlebars middlewar

app.engine('handlebars', exphbs(
  { defaultLayout: 'main' }
))
app.set('view engine', 'handlebars')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// method override middleware

app.use(methodOverride('_method'))

// exoress-session middleware

app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}))

app.use(flash())
// Global variables

app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error')
  next()
})
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
// Idea Index page
app.get('/ideas', (req, res) => {
  Idea.find({})
    .sort({ date: 'desc' })
    .then(ideas => {
      res.render('ideas/index', {
        ideas: ideas
      })
    })
})

// Add Idea Form
app.get('/ideas/add', (req, res) => {
  res.render('ideas/add')
})

// Edit idea form
app.get('/ideas/edit/:id', (req, res) => {
  Idea.findOne({
    _id: req.params.id
  })
    .then(idea => {
      res.render('ideas/edit', {
        idea: idea
      })
    })
})

// Process Form

app.post('/ideas', (req, res) => {
  let errors = []
  if (!req.body.title) {
    errors.push({ text: 'Please add a title' })
  }
  if (!req.body.details) {
    errors.push({ text: 'Please add some details' })
  }
  if (errors.length > 0) {
    res.render('ideas/add', {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    })
  } else {
    const newUser = {
      title: req.body.title,
      details: req.body.details
    }
    new Idea(newUser)
      .save()
      .then(idea => {
        req.flash('success_msg', 'Video idea added')
        res.redirect('/ideas')
      })
  }
})

// Edit form process
app.put('/ideas/:id', (req, res) => {
  Idea.findOne({
    _id: req.params.id
  })
    .then(idea => {
    // change valuyes
      idea.title = req.body.title
      idea.details = req.body.details

      idea.save()
        .then(idea => {
          req.flash('success_msg', 'Video idea updated')
          res.redirect('/ideas')
        })
    })
})

// Delete idea
app.delete('/ideas/:id', (req, res) => {
  Idea.remove({ _id: req.params.id })
    .then(() => {
      req.flash('success_msg', 'Video idea remove')
      res.redirect('/ideas')
    })
})

const port = 5000

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
})
