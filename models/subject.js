var mongoose = require('mongoose');
const Schema = mongoose.Schema

//create schema
var subjectSchema = Schema({
  //_id: mongoose.Schema.Types.ObjectId,
  code: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: String,
  imageRootFolderURL: String,
  notebookRootFolderURL: String,
  image: String
})

var Subject = mongoose.model('Subject', subjectSchema);

module.exports = Subject;
