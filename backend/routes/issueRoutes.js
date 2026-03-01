const express = require('express');
const router = express.Router();
const multer = require('multer');

const { createIssue, getIssues } = require('../controller/issueController');

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

router.post('/report', upload.single('image'), createIssue);
router.get('/', getIssues);

module.exports = router;