const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');

const getCoordsForAddress = require('../util/location');
const HttpError = require('../models/http-error');
const Place = require('../models/place');

const getPlaceById = async (req, res, next) => {
	const placeId = req.params.pid; // { pid: 'p1'}
	let place;
	try {
		place = await Place.findById(placeId);
	} catch (err) {
		return next(
			new HttpError('Something went wrong, could not find a place. Code: #P1F', 500)
		);
	}

	//asynchronus use next for error
	//syncronus can use throw for error

	if (!place) {
		return next(
			new HttpError('Could not find a place for the provided id.', 404)
		);
	}

	res.json({ place: place.toObject({ getters: true }) });
};

const getPlacesByUserId = async (req, res, next) => {
	const userId = req.params.uid; // { pid: 'p1'}
	let places;
	try {
		places = await Place.find({ creator: userId });
	} catch (err) {
		return next(
			new HttpError(
				'Something went wrong, could not find any places. Code: #P2F',
				500
			)
		);
	}

	if (!places || places.length === 0) {
		return next(
			new Error('Could not find places for the provided user id.', 404)
		); //return to not send two responses
	}

	res.json({
		places: places.map((place) => place.toObject({ getters: true })),
	}); //=> {place} => {place: place}
};
const createPlace = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return next(
			new HttpError('Invalid inputs passed, please check your data.', 422)
		);
	}

	const { title, description, address, creator } = req.body;
	let coordinates;
	try {
		coordinates = await getCoordsForAddress(address);
	} catch (error) {
		return next(error);
	}

	const createdPlace = new Place({
		title,
		description,
		address,
		location: coordinates,
		image: 'https://cdn.frankerfacez.com/emoticon/500551/4',
		creator,
	});
	try {
		await createdPlace.save();
	} catch {
		const error = new HttpError(
			'Creating places failed, please try again.',
			500
		);
		return next(error);
	}

	res.status(201).json({ place: createdPlace });
};

const updatePlace = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		console.log(errors);
		next(new HttpError('Invalid inputs passed, please check your data.', 422));
	}

	const { title, description } = req.body;
	const placeId = req.params.pid;

	let place;
	try {
		place = await Place.findById(placeId);
	} catch (err) {
		return next(
			new HttpError('Something went wrong, could not update place. Code: #P3F', 500)
		);
	}

	place.title = title;
	place.description = description;

	try {
		await place.save();
	} catch (err) {
		return next(
			new HttpError('Something went wrong, could not save place. Code: #P3S:', 500)
		);
	}

	res.status(200).json({ place: place.toObject({ getters: true }) });
};
const deletePlace = async (req, res, next) => {
	const placeId = req.params.pid;
	let place;
	try {
		place = await Place.findById(placeId);
	} catch (err) {
		return next(
			new HttpError('Something went wrong, could not find place. Code: #P4F:', 500)
		);
	}

	try {
		await place.remove();
	} catch (err) {
		return next(
			new HttpError('Something went wrong, could not delete place. Code: #P4D:', 500)
		);
	}

	res.status(200).json({ message: 'Deleted Place' });
};

exports.GetPlaceById = getPlaceById;
exports.GetPlacesByUserId = getPlacesByUserId;
exports.CreatePlace = createPlace;
exports.UpdatePlace = updatePlace;
exports.DeletePlace = deletePlace;
