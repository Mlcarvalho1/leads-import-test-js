const express = require('express');
const multer = require('multer');
const { importLeads } = require('../controllers/leadController');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/import', upload.single('file'), importLeads);

module.exports = router;
