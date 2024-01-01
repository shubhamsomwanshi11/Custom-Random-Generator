const express = require('express');
const router = express.Router();
const Controller = require('./controller');

router.get('/:type', Controller.getData);
router.get('/getElement/:id', Controller.getElementData);
router.post('/', Controller.postData);

module.exports = router;