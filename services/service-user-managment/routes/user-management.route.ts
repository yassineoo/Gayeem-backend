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
route.post('/changeState'  ,Authentification(['master','slave']),   userManagementController.changeState); 
route.post('/delete/:id',Authentification(['master','slave']),userManagementController.delete);
route.post('/modifey',Authentification(['master','slave']),userManagementController.modifey);
route.post('/changePassword',userManagementController.changePassword);
route.post('/invite-user',Authentification(['master']),userManagementController.inviteUser)
route.post('/haveIssues',Authentification(['master','slave']),userManagementController.createIssue)
export default route;