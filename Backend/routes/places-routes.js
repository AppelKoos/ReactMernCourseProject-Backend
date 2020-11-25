const express = require('express');
const HttpError = require('../models/http-error');

const placesController = require('../controllers/places-controller');

const router = express.Router();

router.get('/:pid', placesController.GetPlaceById);

router.get('/user/:uid', placesController.GetPlaceByUserId);

router.post('/', placesController.CreatePlace)

module.exports = router;
