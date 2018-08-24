if (process.env.NODE_ENV === 'production') {
  module.exports = 
  {
    mongoURI: 'mongodb://classroom:knowledge101@ds249565.mlab.com:49565/classroom-prod'
  }
} else {
  module.exports = 
  { 
    mongoURI: 'mongodb://localhost/classroom'
  }
}