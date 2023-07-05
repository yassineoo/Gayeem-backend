/* eslint-disable @typescript-eslint/no-namespace */
import { Request, Response } from 'express';
import  Authentication from '../auth';


  
interface LoginData {
	username: string;
	password: string;
	userRole: string;
	email:string;
	consumer : string;
  }

interface User {
  id: string;
  role: string;
}


declare global {
  namespace Express {
    interface Request {
      user: User;
    }
  }
}

class LoginController {


	/**
 * Login endpoint that verifies user credentials and returns a JWT token.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} - A Promise that resolves with the token or rejects with an error.
 */
	static login = async (req:Request, res:Response) => {
 
		try {
			// Extract login data from the request body
			const loginData = req.body;
            console.log(loginData);
			// Attempt to login and retrieve a JWT token
			const response = await Authentication.login(loginData);
			
			// Send the token back in the response
			console.log(response);
			
			res.status(200);
			return res.json(response);
		
		} catch (error) {

			// Handle any errors that occur during the login process
			if (error.message === 'Invalid credentials: username or email') {
				res.status(401);
				return res.json({ message: 'Invalid credentials: username or email' });
			
			} else if (error.message === 'Invalid credentials:password') {

				res.status(401);
				return res.json({ message: 'Invalid password' });
			
			} else {

				console.log(error);
				res.status(500);
				res.json({ error });
			
			}
		
		}

	};



	static signUp = async (req:Request, res:Response) => {
 
		try {
			// Extract login data from the request body
			const signUpData = req.body;
            console.log(signUpData);
			// Attempt to login and retrieve a JWT token
			const response = await Authentication.signUp(signUpData);
			
			// Send the token back in the response
			console.log(response);
			
			res.status(200);
			return res.json(response);
		
		} catch (error) {

			// Handle any errors that occur during the login process
			if (error.message === 'Invalid credentials: username or email') {
				res.status(401);
				return res.json({ message: 'Invalid credentials: username or email' });
			
			} else if (error.message === 'Invalid credentials:password') {

				res.status(401);
				return res.json({ message: 'Invalid password' });
			
			} else {

				//	console.log(error);
				res.status(500);
				res.json({ error });
			
			}
		
		}

	};






}

  
export default LoginController ;
