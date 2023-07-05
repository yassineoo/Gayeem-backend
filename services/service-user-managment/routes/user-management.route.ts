import express from 'express';

import userManagementController from '../controllers/userManagementController';
import Authentification from '../../../middelwares/auth';
const route = express.Router();

/**
 * @route   POST api/login
 * @desc    Login a user and return a JWT token
 * @access  Public
*/

route.get('/getMyUsers',Authentification(['master']), userManagementController.getMyUsers); 
route.post('/activate'  ,Authentification(['master','slave']),   userManagementController.changeState); 
route.post('/delete/:id',Authentification(['master','slave']),userManagementController.delete);
route.post('/modifey',Authentification(['master','slave']),userManagementController.modifey);
export default route;