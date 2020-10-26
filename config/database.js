if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
  module.exports = 
  {
    mongoURI: `${process.env.MONGODB_URI}`
  }
} else {
  module.exports = 
  { 
    mongoURI: 'mongodb://localhost/classroom',
    //mongoURI: 'mongodb+srv://classroom:science101@cluster0.egfbt.mongodb.net/classDB'
  }
}