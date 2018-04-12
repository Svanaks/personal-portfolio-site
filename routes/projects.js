const express = require('express');
const session = require('express-session');
const path = require('path');
const multer  = require('multer');

const router = express.Router();

// Bring in Project Model
const Project = require('../models/project');
const storage = multer.diskStorage({
  destination: './public/assets/images/',
  filename: function(req, file, cb) {
     cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
   }
});

const upload = multer({
  storage: storage,
  limits:{fileSize: 10000000},
  fileFilter: function(req, file, cb){
    checkFileType(file, cb);
  }
}).array('image', 2);

// Check File Type
function checkFileType(file, cb){
  const filetypes = /jpeg|jpg|png|PNG|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname){
    return cb(null, true);
  } else {
    cb('Error : Images Only');
  }
}

// Access Control
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('danger', 'Please login');
  res.redirect('/users/login');
}

// Sort the projects by year
function compare(a, b) {
  if (a.year > b.year) {
    return -1;
  } else if (a.year < b.year) {
    return 1;
  }
  return 0;
}


// get Projects
 router.get('/', (req, res) => {
  Project.find({}, (err, projects) => {
    if (err) {
      console.log(err);
    } else {
      console.log(req.session.lang);
      let lang = req.session.lang;
      if(lang == undefined || !lang){
        lang = 'en';
        console.log('ici?', lang);
      } else {
        console.log('la', lang);
      }
      const projectsSorted = projects.sort(compare);
      var localizedResources = Project.schema.methods.toJSONLocalized(projects, lang);
      res.render('list_project', {
        title: 'Projects',
        lang: lang,
        projects: localizedResources,
        path: '/projects',
      });
    }
  });
});

// Add Route
router.get('/add', ensureAuthenticated, (req, res) => {
  let lang = req.session.lang;
  if(lang == undefined || !lang){
    lang = 'en';
  } else {}
  res.render('add_project', {
    lang: lang,
    title: 'Add Project',
    path: req.path,
  });
});

// Add Project
router.post('/add', ensureAuthenticated, (req, res) => {
    upload(req, res, (err) => {
      if(err){
        res.render('add_project', {
          title: 'Add Project',
          err: err,
        });
      } else {
        if(req.files == undefined){
          req.flash('error', 'No File Selected');
          res.render('add_project');
        } else {
          const project = new Project();
          project.image = req.files[0].filename;
          project.image2 = req.files[1].filename;
          project.name = req.body.name;
          project.slug = req.body.slug;
          project.year = req.body.year;
          project.shortDescription.en = req.body.shortDescriptionEn;
          project.shortDescription.fr = req.body.shortDescriptionFr;
          project.description.en = req.body.descriptionEn;
          project.description.fr = req.body.descriptionFr;
          project.description2.en = req.body.description2En;
          project.description2.fr = req.body.description2Fr;
          project.client = req.body.client;
          project.technology = req.body.technology;
          project.technology2 = req.body.technology2;


          project.save((err) => {
            if (err) {
              console.log(err);
            }
            req.flash('success', 'Project Added');
            res.redirect('/');
          });
        }
      }
    });
});

// Load Edit form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  let lang = req.session.lang;
  if(lang == undefined || !lang){
    lang = 'en';
    console.log('ici?', lang);
  } else {
    console.log('la', lang);
  }
  Project.findById(req.params.id, (err, project) => {
    res.render('edit_project', {
      lang: lang,
      title: 'Edit Project',
      project: project,
      path: req.path,
    });
  });
});

// update Project
router.post('/edit/:id', ensureAuthenticated, (req, res) => {

  Project.findById(req.params.id, function (err, project) {
        if (err) {
            handleError(err)
        }
        else {
          upload(req, res, (err) => {
            console.log(req.files);
            console.log(req.body);
            if(err){
              res.render('edit_project', {
                title: 'Edit Project',
                project: project,
                err: err,
              });
            } else {
              if(req.files == undefined){
                req.flash('error', 'No File Selected');
                res.render('add_project');
              } else {
                project.image = req.files[0].filename;
                project.image2 = req.files[1].filename;
                project.name = req.body.name;
                project.slug = req.body.slug;
                project.year = req.body.year;
                project.shortDescription.en = req.body.shortDescriptionEn;
                project.shortDescription.fr = req.body.shortDescriptionFr;
                project.description.en = req.body.descriptionEn;
                project.description.fr = req.body.descriptionFr;
                project.description2.en = req.body.description2En;
                project.description2.fr = req.body.description2Fr;
                project.client = req.body.client;
                project.technology = req.body.technology;
                project.technology2 = req.body.technology2;

                console.log(project);
                const query = { _id: req.params.id };

                project.save((err) => {
                  if (err) {
                    console.log(err);
                  }
                  req.flash('success', 'Project Updated');
                  res.redirect('/');
                });
              }
            }
          });
        }
    });
});

router.delete('/:id', (req, res) => {
  if (!req.user._id) {
    res.status(500).send();
  }
  const query = { _id: req.params.id };

  Project.remove(query, (err) => {
    if (err) {
      console.log(err);
    }
    res.send('Success');
  });
});

// Get single Project by Slug
router.get('/:slug', (req, res) => {
  Project.findOne({ slug: req.params.slug }, (err, project) => {
    console.log(req.session.lang);
    let lang = req.session.lang;
    if(lang == undefined || !lang){
      lang = 'en';
      console.log('ici?', lang);
    } else {
      console.log('la', lang);
    }
    var localizedResources = Project.schema.methods.toJSONLocalized(project, lang);
    res.render('project', {
      lang: lang,
      project: localizedResources,
    });
  });
});

module.exports = router;
