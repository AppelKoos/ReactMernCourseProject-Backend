const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const User = require('../models/user');

const getUsers = async (req, res, next) => {
	let users;
	try {
		users = await User.find({}, '-passsword');
	} catch (err) {
		return next(
			new HttpError(
				'Failed to retrieve users, try again later. Code: #U3F',
				500
			)
		);
	}

	res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		console.log(errors);
		return next(
			new HttpError('Invalid inputs passed, please check your data.', 422)
		);
	}

	const { name, email, password, places } = req.body;

	let existingUser;
	try {
		existingUser = await User.findOne({ email: email });
	} catch (err) {
		return next(
			new HttpError('Signing up failed, try again later. Code: #U1S', 500)
		);
	}

	if (existingUser) {
		return next(new HttpError('User already exists.', 422));
	}

	const createdUser = new User({
		name,
		email,
		password, //This will be excrypted later
		image:
			'https://pbs.twimg.com/profile_images/1113929952406061056/QZdZjFUw.jpg',
		places,
	});

	try {
		await createdUser.save();
	} catch (err) {
		return next(new HttpError('Creating user failed, please try again.', 500));
	}

	res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
	const { email, password } = req.body;

	let existingUser;
	try {
		existingUser = await User.findOne({ email: email });
	} catch (err) {
		return next(
			new HttpError('Logging in failed, try again later. Code: #U2S', 500)
		);
	}

	if (!existingUser || existingUser.password !== password) {
		return next(new HttpError('Invalid credentials, could not log in.', 401));
	}

	res.json({ message: 'Logged in' });
};

exports.GetUsers = getUsers;
exports.Signup = signup;
exports.Login = login;
