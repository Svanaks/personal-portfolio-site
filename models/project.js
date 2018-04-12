let mongoose = require('mongoose');
var mongooseI18n = require('mongoose-i18n-localize');
// Project Schema
Schema = mongoose.Schema;
let projectSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  year: {
    type: Number,
    required: true
  },
  shortDescription:{
    type: String,
    i18n: true,
    required: true
  },
  description:{
    type: String,
    i18n: true,
    required: true
  },
  description2:{
    type: String,
    i18n: true,
    required: true
  },
  client:{
    type: String,
    required: true
  },
  technology:{
    type: String,
    required: true
  },
  technology2:{
    type: String,
    required: false
  },
  image:{
    type: String,
    required: true
  },
  image2:{
    type: String,
    required: false
  }
});

projectSchema.plugin(mongooseI18n, {
    locales: ['en', 'fr']
});

let Project = module.exports = mongoose.model('Project', projectSchema);
