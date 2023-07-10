import express from 'express';

import DevicesController from '../controllers/devicesControllers';
import Authorization from '../../../middelwares/auth';
const route = express.Router();

/**
 * @route   POST api/login
 * @desc    Login a user and return a JWT token
 * @access  Public
*/

route.get('/getRooms/:id', DevicesController.getRooms); // placeid
route.post('/addRoom',Authorization(['master']) , DevicesController.addRoom); // placeid


export default route;