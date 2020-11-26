const express = require('express');
const { check } = require('express-validator');
const HttpError = require('../models/http-error');

const placesController = require('../controllers/places-controller');

const router = express.Router();

router.get('/:pid', placesController.GetPlaceById);

router.get('/user/:uid', placesController.GetPlacesByUserId);

router.post(
	'/',
	[
		check('title').not().isEmpty(),
		check('description').isLength({ min: 5 }),
		check('address').not().isEmpty(),
	],
	placesController.CreatePlace
);

router.patch(
	'/:pid',
	[check('title').not().isEmpty(), check('description').isLength({ min: 5 })],
	placesController.UpdatePlace
);

router.delete('/:pid', placesController.DeletePlace);

module.exports = router;
