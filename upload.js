var csv = require('fast-csv');
var mongoose = require('mongoose');
var Lesson = require('./models/lesson');
 
exports.post = function (req, res) {
    if (!req.files)
        return res.status(400).send('No files were uploaded.');
     
    var importFile = req.files.file;
 
    var lessons = [];
         
    csv
     .fromString(importFile.data.toString(), {
         headers: true,
         ignoreEmpty: true
     })
     .on("data", function(data){
         data['_id'] = new mongoose.Types.ObjectId();
          
         lessons.push(data);
     })
     .on("end", function(){
         Lesson.create(lessons, function(err, documents) {
            if (err) throw err;
         });
          
         res.send(lessons.length + ' lessons have been successfully uploaded.');
     });
};