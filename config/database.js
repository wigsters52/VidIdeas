if (process.env.NODE_ENV === 'production') {
  module.exports = {
    mongoURI:
      'mongodb+srv://wigsters52:<Tomhanks1!>@clusterdub-meno8.mongodb.net/test?retryWrites=true&w=majority'
  }
} else {
  module.exports = { mongoURI: 'mongodb://localhost/vididea-dev' }
}
