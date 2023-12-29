const express = require('express');
const router = express.Router();
const Controller = require('./controller');

router.get('/', Controller.getData);
router.post('/', Controller.postData);

module.exports = router;