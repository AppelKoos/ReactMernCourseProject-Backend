const {v4: uuidv4} = require('uuid')

const HttpError = require('../models/http-error');

const DUMMY_PLACES = [
	{
		id: 'p1',
		title: 'Empire State Building',
		description: 'Tall building',
		location: {
			lat: 40.7484474,
			lng: -73.9871516,
		},
		address: '20 W 34th St, New York, NY 10001',
		creator: 'u1',
	},
];

const getPlaceById = (req, res, next) => {
	const placeId = req.params.pid; // { pid: 'p1'}
	const place = DUMMY_PLACES.find((p) => {
		return p.id === placeId;
	});

	//asynchronus use next for error
	//syncronus can use throw for error

	if (!place) {
		throw new HttpError('Could not find a place for the provided id.', 404); //throw for example
		//prevoius error code
		// return res
		// 	.status(404)
		// 	.json({ message: 'Could not find a place for the provided id.' });
	}

	console.log('GET Request in Places - Place');
	res.json({ place }); //=> {place} => {place: place}
};

const getPlaceByUserId = (req, res, next) => {
	const userId = req.params.uid; // { pid: 'p1'}
	const place = DUMMY_PLACES.find((p) => {
		return p.creator === userId;
	});

	if (!place) {
		return next(
			new Error('Could not find a place for the provided user id.', 404)
		); //return to not send two responses
	}

	console.log('GET Request in Places - User');
	res.json({ place }); //=> {place} => {place: place}
};
const createPlace = (req, res, next) => {
	const { title, description, coordinates, address, creator } = req.body;
	const createdPlace = {
        id: uuidv4(),
		title,
		description,
		location: coordinates,
		address,
		creator,
	};

	DUMMY_PLACES.push(createdPlace);
	res.status(201).json({ place: createdPlace });
};

exports.GetPlaceById = getPlaceById;
exports.GetPlaceByUserId = getPlaceByUserId;
exports.CreatePlace = createPlace;
