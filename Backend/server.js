// This is the main app.js file
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const HttpError = require('./models/http-error');

const placesRoutes = require('./routes/places-routes');
const userRoutes = require('./routes/users-routes');

dotenv.config({ path: './config.env' });

const server = express();

server.use(bodyParser.json());

server.use('/api/places', placesRoutes);
server.use('/api/users', userRoutes);

server.use((req, res, next) => {
	const error = new HttpError('Could not find this route.', 404);
	throw error;
});

server.use((error, req, res, next) => {
	if (res.headerSent) {
		return next(error); //can only send one res helper function to check if the headers have been sent
	}
	res
		.status(error.code || 500)
		.json({ message: error.message || 'An unkown error occurred!' });
});

mongoose
	.connect(
		`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.n6hoq.mongodb.net/places?retryWrites=true&w=majority`
	)
	.then(() => {
		server.listen(5000);
	})
	.catch((err) => {
		console.log('###!###  !  ERROR  !  ###!###  !  ERROR  !  ###!###');
		console.log(err);
		console.log('###^###  ^  ERROR  ^  ###^###  ^  ERROR  ^  ####^###');
	});
