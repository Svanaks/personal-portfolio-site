const cookieSession = require('cookie-session');
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const nodemailer = require('nodemailer');
const session = require('express-session');
const passport = require('passport');
const config = require('./config/database');
const expressMessages = require('express-messages');
const gmailcred = require('./config/gmail.js');
const request = require('request');


mongoose.connect(config.database);
const db = mongoose.connection;

// Check Connection
db.once('open', () => {
  console.log('Connected to MongoDb');
});
// Check for Db errors
db.on('error', (err) => {
  console.log(err);
});
// Init App
const app = express();


// Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


// parse application/json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

// Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session Middleware
app.use(session({
  secret: 'yourPwd',
  resave: false,
  saveUninitialized: true
}));

// Express Messages Middleware
app.use(require('connect-flash')());
app.use((req, res, next) => {
  res.locals.messages = expressMessages(req, res);
  next();
});

// Express Validator Middleware
app.use(expressValidator({
  errorFormatter: function errorFormatter(param, msg, value) {
    const namespace = param.split('.');
    const root = namespace.shift();
    let formParam = root;

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg: msg,
      value: value,
    };
  },
}));


// Passport Config
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

// Mailer
app.post('/sendMail', function(req, res, next) {
  // Captcha settings
  if(
    req.body.captcha === undefined ||
    req.body.captcha === '' ||
    req.body.captcha === null
  ){
    return res.json({"success": false, "msg":"Please select captcha"});
  }

  // Secret Key
  const secretKey = 'YourSecretKeyForGoogleCaptcha';

  // Verify Url
  const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body.captcha}&remoteip=${req.connection.remoteAddress}`;

  // Make request to verifyUrl
  request(verifyUrl, (err, response, body) => {
    body = JSON.parse(body);

    // If Not Successful
    if(body.success != undefined && !body.success){
      return res.json({"success": false, "msg":"Failed captcha verification"}); 
    } else {
      // Successful
      let mailOptions = {
        from: req.body.from, // sender address
        to: req.body.to, // list of receivers
        subject: req.body.subject, // Subject line
        text: 'You recieved a mail from '+ req.body.from+ ' :'+req.body.text,
        html: 'You recieved a mail from '+ req.body.from+ ' :<br/><br/>'+req.body.text,
      };

      console.log(mailOptions);
      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: gmailcred
      });
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error);
          res.json({code:500,data:error});
    
        }
        console.log('Message %s sent: %s', info.messageId, info.response);
        return res.json({"success": true, "msg":"Captcha passed", "url":"/"});
      });      
    } 
  });
});


// Change lang
app.post('/lang/:lang', function(req, res) {
  req.session.lang = req.params.lang;
  res.send('Success');
});

// We want this for all routes
app.get('*', (req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// Es6 Syntax
// Home Route
app.get('/', (req, res) => {
  let lang = req.session.lang;
  if(lang == undefined || !lang){
    lang = 'en';
  } else {}
  res.render('index', {
    title: 'William Bloch',
    lang: lang
  });
});


// Route Files
const projects = require('./routes/projects');
const users = require('./routes/users');


app.use('/projects', projects);
app.use('/users', users);


// About Route
app.get('/about', (req, res) => {
  let lang = req.session.lang;
  if(lang == undefined || !lang){
    lang = 'en';
  } else {}
  res.render('about', {
    path: req.path,
    lang: lang
  });
});

// Contact Route
app.get('/contact', (req, res) => {
  let lang = req.session.lang;
  if(lang == undefined || !lang){
    lang = 'en';
  } else {}
  res.render('contact', {
    path: req.path,
    lang: lang
  });
});

// Contact Route
app.get('/resume', (req, res) => {
  let lang = req.session.lang;
  if(lang == undefined || !lang){
    lang = 'en';
  } else {}
  res.render('resume', {
    path: req.path,
    lang: lang
  });
});

// Start Server
app.listen(3000, () => {
  console.log('Server started on port 3000...');
});
