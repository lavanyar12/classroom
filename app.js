const express = require('express')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const handlebars = require('handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const session = require('express-session')
const path = require('path')
const passport = require('passport')

const app = express()
const server = require('http').Server(app)

//Load routes (in routes folder - subjects/lessons/users/...)
const lessons = require('./routes/lessons')
const subjects = require('./routes/subjects')
const users = require('./routes/users')
const db = require('./config/database')

//Passport Config - load local strategy
require('./config/passport')(passport)

//proxy to serve css, img and js folders in views
app.use('/public', express.static('views'))
//Static folder
app.use(express.static(path.join(__dirname, 'public')))

//Map global promise - get rid of warning
mongoose.Promise = global.Promise;

//connect to mongoose remote DB on mlab or 
mongoose.connect(db.mongoURI, {
   useNewUrlParser: true 
})
  .then(() => console.log(`Connection to NODE_ENV [${process.env.NODE_ENV}] with MONGODB_URI [${db.mongoURI}] successful`))
  .catch(err => console.log(`Connection to NODE_ENV [${process.env.NODE_ENV}] with MONGODB_URI [${db.mongoURI}] unsuccessful with ${err.error_msg}`))

// Handlebars middleware - setting the engine
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
app.engine('handlebars', exphbs({
  defaultLayout: 'default',
  helpers: { //not used yet
    section: function (name, options) {
      if (!this._sections) this._sections = {};
      this._sections[name] = options.fn(this);
      return null;
    },
    // ...implement newly added insecure prototype access
    handlebars: allowInsecurePrototypeAccess(handlebars)
  }
}))
app.set('view engine', 'handlebars');

// Body parser middleware
// allows access to whatever is submitted in the form body
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// method override middleware - overriding PUT and DELETE methods
app.use(methodOverride('_method'))

// Express session middleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

//for flash messaging
app.use(flash());

// Global variables for messages
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null
  res.locals.adminUser = (req.user && req.user.accountType === 'ADMIN') || null
  res.locals.studentSubject = (req.user && req.user.accountType != 'ADMIN') ? req.user.studentSubject : null
  switch (res.locals.studentSubject) {
    case 'MS':
      res.locals.studentSubjectName = 'Marine Science'
      break;
    case 'MB':
      res.locals.studentSubjectName = 'Marine Biology'
      break;
    case 'GEO':
      res.locals.studentSubjectName = 'Geology'
      break;
    case 'BIO':
      res.locals.studentSubjectName = 'Biology'
      break;
    case 'FORENSICS':
      res.locals.studentSubjectName = 'Forensics'
      break; 
    default:
      res.locals.studentSubjectName = 'Marine Science'
  }
  //console.log(req.user)
  next();
});

var Subject = require('./models/subject');

//About route
app.get('/about', (req, res) => {
  Subject.find({})
    .lean()
    .sort({ name: 'asc' })
    .then(subjects => {
      res.render('about', {
        subjects: subjects,
        layout: 'main'
      })
    })
})

// HOME page
app.get('/home', (req, res) => {
  res.render('home', {
    layout: 'main'
  })
})

// HOME page
app.get('/', (req, res) => {
  res.render('home', {
    layout: 'main'
  })
})

// Student login
app.get('/users/studentlogin', (req, res) => {
  if (res.locals.user) {
    res.render('home', {
      layout: 'main'
    })
  } else {
    res.render('users/studentlogin', {
      layout: 'main'
    })
  }
})

// Admin login
app.get('/users/login', (req, res) => {
  if (res.locals.user) {
    res.redirect('/lessons')
  } else {
    res.render('users/login')
  }
})

//Use routes
app.use('/lessons', lessons)
app.use('/subjects', subjects)
app.use('/users', users)

const port = process.env.PORT || 5000

server.listen(port, () => {
  console.log(`Server started on port ${port} env ${process.env.NODE_ENV}`)
})