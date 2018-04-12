const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const router = express.Router();

// Contact Route
router.get('/', (req, res) => {
  res.render('contact', {
    path: req.path,
  });
});

module.exports = router;
