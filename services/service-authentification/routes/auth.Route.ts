import express from 'express';

import LoginController from '../controllers/auth.Controller';
const route = express.Router();

/**
 * @route   POST api/login
 * @desc    Login a user and return a JWT token
 * @access  Public
*/

route.post('/login', LoginController.login); // placeid
route.post('/signup', LoginController.signUp); 
export default route;