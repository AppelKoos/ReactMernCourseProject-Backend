// This is the main app.js file
const express = require('express');
const bodyParser = require('body-parser');

const placesRoutes = require('./routes/places-routes');
const userRoutes = require('./routes/users-routes');

const server = express();

server.use('/api/places', placesRoutes);
server.use('/api/users', userRoutes);

server.listen(5000);
