const express = require('express');

const router = express.Router();

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

router.get('/:pid', (req, res, next) => {
	const placeId = req.params.pid; // { pid: 'p1'}
	const place = DUMMY_PLACES.find((p) => {
		return p.id === placeId;
	});
	console.log('GET Request in Places - Place');
	res.json({ place }); //=> {place} => {place: place}
});

router.get('/user/:uid', (req, res, next) => {
	const userId = req.params.uid; // { pid: 'p1'}
	const place = DUMMY_PLACES.find((p) => {
		return p.creator === userId;
	});
	console.log('GET Request in Places - User');
	res.json({ place }); //=> {place} => {place: place}
});

module.exports = router;
