const express = require('express')
const router = express.Router()
const {ensureAuthenticated} = require('../helpers/auth')

module.exports = router

var Subject = require('../models/subject');

// BEGIN
//-------------------SUBJECT ROUTES ------------------------//
// GET All Subjects route
router.get('/', ensureAuthenticated, (req, res) => {

  Subject.find({})
    .sort({ name: 'asc' })
    .then(subjects => {
      res.render('subjects/index', {
        subjects: subjects
      })
    })
})

// --------- ADD Subject form
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('subjects/add')
})

// --------- GET Subject by id for EDIT form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Subject.findOne({
    _id: req.params.id
  })
    .then(subject => {
      res.render('subjects/edit', {
        subject: subject
      })
    })
})

// --------- DELETE Subject
router.delete('/:id', ensureAuthenticated, (req, res) => {
  Subject.deleteOne({
    _id: req.params.id
  })
    .then(() => {
      req.flash('success_msg', 'Subject deleted');
      res.redirect('/subjects')
    })
 })

//---------- Process EDIT Subject form (PUT)
router.put('/:id', ensureAuthenticated, (req, res) => {
  Subject.findOne({
    _id: req.params.id
  })
    .then(subject => {

      //new values
      subject.code = req.body.code,
        subject.type = req.body.type,
        subject.name = req.body.name,
        subject.description = req.body.description,
        subject.notebookRootFolderURL = req.body.notebookRootFolderURL,
        subject.imageRootFolderURL = req.body.imageRootFolderURL,
        subject.image = req.body.image,

        subject.save()
          .then(subject => {
            req.flash('success_msg', 'Subject saved');
            res.redirect('/subjects')
          })
    })

})

//---------- Process ADD form (POST)
router.post('/', ensureAuthenticated, (req, res) => {
  let errors = []

  if (!req.body.code) {
    errors.push({ text: 'Please add a code' })
  }
  if (!req.body.type) {
    errors.push({ text: 'Please add type' })
  }
  if (!req.body.name) {
    errors.push({ text: 'Please add name' })
  }

  if (errors.length > 0) {
    res.render('subjects/add', {
      errors: errors,
      code: req.body.code,
      type: req.body.type,
      name: req.body.name,
      description: req.body.description,
      imageRootFolderURL: req.body.imageRootFolderURL,
      notebookRootFolderURL: req.body.notebookRootFolderURL,
      image: req.body.image
    })
  } else {
    const newUser = {
      code: req.body.code,
      type: req.body.type,
      name: req.body.name,
      description: req.body.description,
      imageRootFolderURL: req.body.imageRootFolderURL,
      notebookRootFolderURL: req.body.notebookRootFolderURL,
      image: req.body.image
      //user: req.user.id for later
    }
    new Subject(newUser)
      .save()
      .then(subject => {
        req.flash('success_msg', 'Subject added');
        res.redirect('/subjects')
      })
  }
})