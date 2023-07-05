/* eslint-disable @typescript-eslint/no-namespace */
import { Request, Response, NextFunction } from 'express';
import Authentication from '../services/service-authentification/auth';
interface User {
  id: string;
  role: string;
}





const Authorization = (allowedRoles: string[]) => {

	return async (req: any, res: Response, next: NextFunction) => {

		try {
     
			const token = req.header('Authorization')?.replace('Bearer ', '');

			
			if (!token) {

				res.status(401);
				return res.json({ error: 'Access denied. No token provided.' });
			
			}
   
			
			const decoded = await Authentication.verifyToken(token) as unknown as User;
      
			req.user = {id:decoded?.id,role:decoded.role};
            console.log(allowedRoles);
            console.log(decoded.role);

			if (!allowedRoles.includes(decoded.role)) {

				res.status(403);
				return res.json({ error: 'Access denied. You are not authorized to access this resource.' });
			
			}

			next();
		
		} catch (error) {

			if (error.message === 'jwt expired') {
					
				res.status(401).json({ error: 'Token expired' });
			
			} else if (error.name === 'JsonWebTokenError') {

				res.status(401).json({ error: 'Invalid token' });
			
			} else {

				next(error);
			
			}
		
		}
	
	};

};


export  default Authorization;