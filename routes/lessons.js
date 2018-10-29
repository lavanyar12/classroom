const express = require('express')
const router = express.Router()
const {ensureAuthenticated, adminUser} = require('../helpers/auth')
module.exports = router

var Lesson = require('../models/lesson');
var Subject = require('../models/subject');

//-------------------------LESSONS ------------------------//

// GET All lessons route
router.get('/notinuse', ensureAuthenticated, adminUser, (req, res) => {
  Lesson.find({})
    .sort({ subject: 'asc' })
    .sort({ semester: 'asc' })
    .sort({ lessonId: 'asc' })
    .then(lessons => {
      const count = lessons.length
      res.render('lessons/index', {
        lessons: lessons,
        count: count
      })
    })
})

// GET All lessons route
router.get('/', ensureAuthenticated, adminUser, (req, res) => {
  Subject.find({}).then((subjects) => {
    Lesson.aggregate([{ $group: { _id: {subject: "$subject", semester: "$semester"},  count:{ $sum: 1 } } } ])
    .sort({ "_id.subject": 'asc', "_id.semester": 'asc' })
    .then(lessons => {
      lessons.forEach((lesson) => {
        const subjectObj = getByKey(subjects, lesson._id.subject)
        lesson._id.subjectName = subjectObj.name
        })
       res.render('lessons/index', {
        lessons: lessons,
        subjects: subjects
       })
    })
  })
})

// --------- ADD Lessons form
router.get('/add', ensureAuthenticated, adminUser, (req, res) => {
  Subject.find({}).then((results) => {
    var subjectObj = getByKey(results, req.query.subject)
    res.locals.selectedSubject = req.query.subject
    res.locals.selectedSubjectName = subjectObj.name
    res.render('lessons/add'), {
      subjectObj: subjectObj
    }
  })
})

// --------- GET Lesson by id for EDIT form
router.get('/edit/:id', ensureAuthenticated, adminUser, (req, res) => {  
  Lesson.findOne({
    _id: req.params.id
  })
    .then(lesson => {
      res.render('lessons/edit', {
        lesson: lesson
      })
    })
})

// --------- DELETE Lesson
router.delete('/:id', ensureAuthenticated, adminUser, (req, res) => {
  Lesson.deleteOne({
    _id: req.params.id
  })
    .then(() => {
      req.flash('success_msg', 'Lesson deleted');
      res.redirect('/lessons')
    })
})

//---------- Process EDIT Lessons form (PUT)
router.put('/:id', ensureAuthenticated, adminUser, (req, res) => {
  //console.log(req.body)
  req.body.documentLink = 'NB'+req.body.lessonId+'.pdf'
  req.body.image = 'IMAGE'+req.body.lessonId+'.jpg'
  Lesson.findOne({
    _id: req.params.id
  })
    .then(lesson => {

      //console.log(lesson)
      //new values
      lesson.subject = req.body.subject,
      lesson.semester = req.body.semester,
      lesson.lessonId = req.body.lessonId,
      lesson.title = req.body.title,
      lesson.description = req.body.description,
      lesson.videoTitle = req.body.videoTitle,
      lesson.videoLink = req.body.videoLink,
      lesson.careerTitle = req.body.careerTitle,
      lesson.careerLink = req.body.careerLink,
      lesson.movieTitle = req.body.movieTitle,
      lesson.movieLink = req.body.movieLink,
      lesson.documentLink = req.body.documentLink,
      lesson.image = req.body.image

      lesson.save()
        .then(lesson => {
          req.flash('success_msg', 'Lesson ' +  lesson.lessonId + ' saved');
          res.redirect('/lessons/'+lesson.subject+'/'+lesson.semester)
        })
    })

})

// GET Lessons by subject and semester # - VIEW only
router.get('/view/:subject/:semester', ensureAuthenticated, (req, res) => {
  Subject.find({}).then((results) => {
    var subjectObj = getByKey(results, req.params.subject)
    Lesson.find({
      subject: req.params.subject,
      semester: req.params.semester
      })
      .sort({ 'lessonId': 'asc' })
      .then(lessons => {
        const count = lessons.length
        res.render('lessons/view', {
          lessons: lessons,
          count: count,
          subject: subjectObj.name,
          notebookLink: subjectObj.notebookRootFolderURL,
          imageLink: subjectObj.imageRootFolderURL,
          semester: req.params.semester,
          layout: 'main'
      })
    })
  })
})


// GET Lessons by subject and semester # - VIEW / EDIT
router.get('/:subject/:semester', ensureAuthenticated, (req, res) => {
  Subject.find({}).then((results) => {
    var subjectObj = getByKey(results, req.params.subject)
    //console.log(subjectObj)
    Lesson.find({
      subject: req.params.subject,
      semester: req.params.semester
    })
    .sort({ 'lessonId': 'asc' })
    .then(lessons => {
      const count = lessons.length
      res.render('lessons/list', {
        lessons: lessons,
        count: count,
        subject: subjectObj.name,
        notebookLink: subjectObj.notebookRootFolderURL,
        imageLink: subjectObj.imageRootFolderURL,
        semester: req.params.semester
      })
    })
  })
})

//---------- Process ADD form (POST)
router.post('/', ensureAuthenticated, adminUser, (req, res) => {
  let errors = []
  req.body.documentLink = 'NB'+req.body.lessonId+'.pdf'
  req.body.image = 'IMAGE'+req.body.lessonId+'.jpg'
  if (errors.length > 0) {
    res.render('lessons/add', {
      errors: errors,
      subject: req.body.subject,
      semester: req.body.semester,
      lessonId: req.body.lessonId,
      title: req.body.title,
      description: req.body.description,
      videoTitle: req.body.videoTitle,
      videoLink: req.body.videoLink,
      careerTitle: req.body.careerTitle,
      careerLink: req.body.careerLink,
      movieTitle: req.body.movieTitle,
      movieLink: req.body.movieLink,
      documentLink: req.body.documentLink,
      image: req.body.image
    })
  } else {

    const newUser = {
      subject: req.body.subject,
      semester: req.body.semester,
      notebook: req.body.notebook,
      lessonId: req.body.lessonId,
      title: req.body.title,
      description: req.body.description,
      videoTitle: req.body.videoTitle,
      videoLink: req.body.videoLink,
      careerTitle: req.body.careerTitle,
      careerLink: req.body.careerLink,
      movieTitle: req.body.movieTitle,
      movieLink: req.body.movieLink,
      documentLink: req.body.documentLink,
      image: req.body.image
      //user: req.user.id for later
    }

    new Lesson(newUser)
      .save()
      .then(lesson => {
        req.flash('success_msg', 'Lesson added');
        res.redirect('/lessons/'+lesson.subject+'/'+lesson.semester)
      })
  }
})
// END

function getByKey(results, key) {
  var object
  for (var i = 0; i < results.length; i++) {
    if (results[i].code === key) {
      object = results[i]
    }
  }
  return object
}
