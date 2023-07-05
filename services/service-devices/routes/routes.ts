import express from 'express';

import DevicesController from '../controllers/devicesControllers';
const route = express.Router();

/**
 * @route   POST api/login
 * @desc    Login a user and return a JWT token
 * @access  Public
*/

route.get('/getRooms/:id', DevicesController.getRooms); // placeid
route.get('/addRoom', DevicesController.getRooms); // placeid


export default route;