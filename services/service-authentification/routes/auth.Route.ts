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


/**
 * @route   POST /api/send-verification
 * @desc    Send verification number to a user
 * @access  Public
 */
route.post('/send-verification', LoginController.sendVerificationNumber);

/**
 * @route   POST /api/verify-number
 * @desc    Verify the entered verification number
 * @access  Public
 */
route.post('/verify-number', LoginController.verifyNumber);

export default route;