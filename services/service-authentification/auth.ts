/* eslint-disable @typescript-eslint/no-namespace */
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import * as nodemailer from 'nodemailer';
import  prisma  from '../../prisma/dbConnection' ;

	interface User {
	id: string;
	role: string;
	exp:number;
	}


  
  interface LoginData {
	username: string;
	password: string;
  }



class  Authentication {

	private static jwtSecret = 'secret';


	/**
 * Verify a JWT token and return the decoded user object if valid
 * @param {string} token - The JWT token to verify
 * @returns {Promise<User | null>} - A promise that resolves to the decoded user object if the token is valid, otherwise null
 */
	static verifyToken = async (token: string): Promise<User | null> => {

		// eslint-disable-next-line no-useless-catch
		try {
			
			

			// Verify the token using the JWT secret
			const decodedToken = await jwt.verify(token, this.jwtSecret) as User ;
			//console.log();
			
			// Check if the token has expired
			if (Date.now() >= decodedToken.exp * 1000) {

				throw new Error('Token expired');
			
			}

			// Return the decoded user object if everything is valid
			return decodedToken;

		} catch (error) {

			// Throw any error that occurs during the token verification
			throw error;
		
		}

	};

	


	/**
 * Logs a user in and returns a JWT token.
 * @async
 * @function
 * @param {Object} loginData - The login data object.
 * @param {string} loginData.username - The user's username.
 * @param {string} loginData.password - The user's password.
 * @param {string} loginData.userRole - The user's role.
 * @param {string} loginData.email - The user's email.
 * @returns {Promise<string>} A Promise that resolves with a JWT token.
 * @throws {Error} If the credentials are invalid.
 */
	static login = async (loginData: LoginData) => {

		// Destructure loginData object
		const { username, password,  } = loginData;
 
		let user;
		
		// Find user by username or email
			user = await prisma.users.findFirst({
				where: { username : username}
			});

		
		
		// Throw error if user not found
		if (!user) {

			throw new Error('Invalid credentials: username or email');
		
		}

		// Check password
		const passwordMatch = await bcrypt.compare(
			password,
			user.password
		);
		if (!passwordMatch) {

			throw new Error('Invalid credentials:password');
		
		}

		// Create JWT
		const token = jwt.sign(
			{ id: user.id, role: user.role},
			this.jwtSecret
		);
		const response = {token,...user};
		return response;

	};


	static signUp = async (loginData) => {

		// Destructure loginData object
		const { username, password,email,master  } = loginData;
 
		let user;
		
		// Find user by username 
			user = await  prisma.users.findFirst({
				where: { username : username}
			});

		
		
		// Throw error if user  found
		if (user) {

			throw new Error(' username or email already exist');
		
		}
		let idMaster = master;
		let role = "slave";
		if (master) {
			role = "master";
			idMaster = null;

		}

		// Hash password
		const passwordHashed = await bcrypt.hash(
			password,	10		
		);

		// Create user
		user = await prisma.users.create({	
			data: {
				 role,email, idMaster,username  ,password: passwordHashed
			}
		});

		
		

		// Create JWT
		const token = jwt.sign(
			{ id: user.id, role: user.role},
			this.jwtSecret
		);
		const response = {token,...user};
		return response;

	};


	async sendVerificationNumber(username: string): Promise<void> {
		const user = await prisma.users.findFirst({ where: { username: username } });
    
		if (!user) {
		  throw new Error("User not found.");
		}
		const verificationNumber = this.generateVerificationNumber(6);

		// Save the verification number to the user record in the database
	// Save the verification number to the user record in the database
		await prisma.users.update({
				where: { id: user.id },
				data: { verification_number: Number(verificationNumber) },
			});
  
		
		// create reusable transporter object using the default SMTP transport
		const transporter = nodemailer.createTransport({
		  host: 'smtp.gmail.com',
		  port:587,
		  secure:false,
			  auth:{
				  user:'aissanyris84',
				  pass:'fluccvroupxcmrdv',
			  },
			  tls: {
				  rejectUnauthorized: true
			  }
		});
	  
		// send mail with defined transport object
		const info = await transporter.sendMail({
		  from: 'aissanyris84',// sender mail
		  to: user.email, // list of receivers
		  subject: "verfivication number", // Subject line
		  html: `
			<p>someone has tried to reset password and this is your verfivication number ${78564} if u are not the one who did this pleas tell us 
			 </p>
		  `, // HTML body
		});
	  
		console.log(`Message sent: ${info.messageId}`);
	  }

	 generateVerificationNumber(length: number): string {
		const characters = '0123456789';
		let verificationNumber = '';
	  
		for (let i = 0; i < length; i++) {
		  const randomIndex = Math.floor(Math.random() * characters.length);
		  verificationNumber += characters[randomIndex];
		}
	  
		return verificationNumber;
	  }


}

export  default  Authentication;