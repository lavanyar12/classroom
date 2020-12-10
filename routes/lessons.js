const express = require('express')
const router = express.Router()
const {ensureAuthenticated, adminUser} = require('../helpers/auth')
module.exports = router
var validUrl = require('valid-url');

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
      lessons.forEach(async (lesson) => {
        const subject = await subjects.find((x) => x.code === lesson._id.subject)
        lesson._id.subjectName = subject.name
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
  Subject.find({}).then((subjects) => {
    var subjectObj = subjects.find((x) => x.code == req.query.subject)
    res.locals.selectedSubject = req.query.subject
    res.locals.selectedSubjectName = subjectObj.name
    let videos = []
    for (let index = 0; index <= 3; index++) {
        videos.push({id: index+1, title: null, link: null})
    }
    res.locals.videos = videos
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
      let videos = []
      for (let index = 0; index < 4; index++) {
        if (!lesson.videos || !lesson.videos[index]) {
          videos.push({id: index, title: null, link: null})
        } else {
          videos.push({
            id: lesson.videos[index].id, 
            title: lesson.videos[index].title,
            link: lesson.videos[index].link
          })
        }
      }
      // console.log(videos)
      lesson.videos = videos
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

//---------- Process ADD form (POST)
router.post('/', ensureAuthenticated, adminUser, (req, res) => {
  let errors = []
  req.body.documentLink = 'NB'+req.body.lessonId+'.pdf'
  req.body.image = 'IMAGE'+req.body.lessonId+'.jpg'

  let videos = []
  const videoTitles = req.body.videoTitles;
  const videoLinks = req.body.videoLinks;
  // console.log(videoLinks);
  // console.log(videoTitles)
  for (let index = 0; index <= 3; index++) {
    videos.push({
        id: index+1, 
        title: videoTitles[index] ? videoTitles[index] : '',
        link: videoLinks[index] ? videoLinks[index] : '',
        valid: videoLinks[index] ? validVideo(videoLinks[index]) : false
    })
  }
  
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
      image: req.body.image,
      videos: videos
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
      image: req.body.image,
      videos: videos
      //user: req.user.id for later
    }

    new Lesson(newUser)
      .save()
      .then(lesson => {
        // console.log(lesson)
        req.flash('success_msg', 'Lesson added');
        res.redirect('/lessons/'+lesson.subject+'/'+lesson.semester)
      })
  }
})

//---------- Process EDIT Lessons form (PUT)
router.put('/:id', ensureAuthenticated, adminUser, (req, res) => {
  req.body.documentLink = 'NB'+req.body.lessonId+'.pdf'
  req.body.image = 'IMAGE'+req.body.lessonId+'.jpg'
  Lesson.findOne({
    _id: req.params.id
  })
    .then(lesson => {

      // console.log(req.body)
      let videos = []
      const videoTitles = req.body.videoTitles;
      const videoLinks = req.body.videoLinks;
      for (let index = 0; index <= 3; index++) {
        let video = [];
        videos.push({
            id: index+1, 
            title: videoTitles[index],
            link: videoLinks[index],
            valid: validVideo(videoLinks[index])
          })
      }
      // console.log(videos)

      //new values
      lesson.subject = req.body.subject
      lesson.semester = req.body.semester
      lesson.lessonId = req.body.lessonId
      lesson.title = req.body.title
      lesson.description = req.body.description
      // lesson.videoTitle = req.body.videoTitle
      // lesson.videoLink = req.body.videoLink
      lesson.careerTitle = req.body.careerTitle
      lesson.careerLink = req.body.careerLink
      lesson.movieTitle = req.body.movieTitle
      lesson.movieLink = req.body.movieLink
      lesson.documentLink = req.body.documentLink
      lesson.videos = videos
      lesson.image = req.body.image

      lesson.save()
        .then(lesson => {
          // console.log(lesson)               
          req.flash('success_msg', 'Lesson ' +  lesson.lessonId + ' saved');
          res.redirect('/lessons/'+lesson.subject+'/'+lesson.semester)
        })
    })

})

// GET Lessons by subject and semester # - VIEW only
router.get('/view/:subject/:semester', ensureAuthenticated, (req, res) => {
  Subject.find({}).then((subjects) => {
    var subjectObj = subjects.find((x) => x.code == req.params.subject)
    Lesson.find({
      subject: req.params.subject,
      semester: req.params.semester
      })
      .sort({ 'lessonId': 'asc' })
      .then(lessons => {
        const count = lessons.length
        lessons.forEach(x => {
          x.validMovieUrl = x.movieLink ? validVideo(x.movieLink) : false
        })
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
  Subject.find({}).then((subjects) => {
    var subjectObj = subjects.find((x) => x.code == req.params.subject)
    //console.log(subjectObj)
    Lesson.find({
      subject: req.params.subject,
      semester: req.params.semester
    })
    .sort({ 'lessonId': 'asc' })
    .then(lessons => {
      //console.log(subjectObj)
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

//---------- Migrate video attributes to array (POST)
router.get('/videos/migration/:subject/:semester', ensureAuthenticated, adminUser, (req, res) => {

Lesson.find({  
    subject: req.params.subject,
    semester: req.params.semester
}).then(lessons => {
  lessons.forEach((lesson) => {
    if (lesson.videos.length == 0) {
        const videos = []
        videos.push({
              id: 1, 
              title: lesson.videoTitle,
              link: lesson.videoLink,
              valid: validVideo(lesson.videoLink)
          })
          for (i=1; i<4; i++) {
            videos.push({
              id: i+1, 
              title: '',
              link: '',
              valid: false
            })
          }
          lesson.videos = videos
          lesson.save()
        }
      })
    }).then(() => {
      req.flash('success_msg', 'Lessons migrated');
      res.redirect('/lessons')
  })
})

// END
function getByKey(results, key) {
  return results.find((x) => x.code === key) 
}

function validVideo(url) {
  if (url && validUrl.isUri(url) 
      && !url.includes('coursera.org') && !url.includes('futurelearn.com') || url.includes('ck12.org')){
    return true
  } 
  else {
    return false
  }
}