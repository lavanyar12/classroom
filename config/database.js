if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
  module.exports = 
  {
    mongoURI: `${process.env.MONGODB_URI}`
  }
} else {
  module.exports = 
  { 
    mongoURI: 'mongodb://localhost/classroom',
  }
}