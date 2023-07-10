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


	static async sendVerificationNumber(req: Request, res: Response) {
		const { username } = req.body;
	
		try {
		  await Authentication.sendVerificationNumber(username);
	
		  res.status(200).json({ message: 'Verification number sent successfully.' });
		} catch (error) {
		  console.error('Error sending verification number:', error);
		  res.status(500).json({ error: 'Failed to send verification number.' });
		}
	  }
	
	  static async verifyNumber(req: Request, res: Response) {
		const { username, verificationNumber } = req.body;
	
		try {
		  console.log('-------------------------------------')	
		  console.log(req.body)	
		  console.log('-------------------------------------')	

		  const verified = await Authentication.verifyVerificationNumber(username, verificationNumber);
	
		  if (verified) {
			res.status(200).json({ message: 'Verification successful.' , id:verified.id });
		  } else {
			res.status(400).json({ error: 'Invalid verification number.' });
		  }
		} catch (error) {
		  console.error('Error verifying verification number:', error);
		  res.status(500).json({ error: 'Failed to verify verification number.' });
		}
	  }






}

  
export default LoginController ;
