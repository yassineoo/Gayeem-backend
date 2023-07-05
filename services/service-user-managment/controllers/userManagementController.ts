import { Request, Response } from 'express';
import  UserManagementService from '../user-management'; 

class userManagmentController {

    static getMyUsers = async (req: Request, res: Response) => {
        try {
          const idMaster = req.user?.id ; // Assuming the middleware adds the id of the requester to req.user.id
          const users = await UserManagementService.getMyUsers(idMaster);
          
          
          res.status(200).json(users);
        } catch (error) {
          console.error("Error retrieving users:", error);
          res.status(500).json({ error: "Failed to retrieve users." });
        }
      };
    static changeState = async (req: Request, res: Response) => {
        try {
          const requesterId = req.user?.id ; // Assuming the middleware adds the id of the requester to req.user.id    
          const { state, userId } = req.body;
          console.log("requesterId",requesterId);
          console.log("state",state);
          console.log("userId",userId);
          
          await UserManagementService.changeState(requesterId, state, userId);
    
          res.status(200).json({ message: "User's state changed successfully." });
        } catch (error) {
          console.error("Error changing user's state:", error);
          res.status(500).json({ error: "Failed to change user's state." });
        }
      };
    static delete = async (req: Request, res: Response) => {
        try {
          const requesterId = req.user?.id ;
          const { userId, nextMaster } = req.body;
    
          await UserManagementService.delete(requesterId, userId, nextMaster);
    
          res.status(200).json({ message: "User deleted successfully." });
        } catch (error) {
          console.error("Error deleting user:", error);
          res.status(500).json({ error: "Failed to delete user." });
        }
      };

      static changePassword = async (req: Request, res: Response) => {
        try {
          
          const { id, password } = req.body;
    
          await UserManagementService.changePassword(id, password);
    
          res.status(200).json({ message: "User's password changed successfully." });
 
        }
        catch (error) {
          console.error("Error changing user's password:", error);
          res.status(500).json({ error: "Failed to change user's password." });
        }
      };
    
      static modifey = async (req: Request, res: Response) => {
        try {
          const requesterId = req.user?.id ; // Assuming the middleware adds the id of the requester to req.user.id    

          const { userId, ...data } = req.body;
    
          await UserManagementService.modifey(requesterId, userId, data);
    
          res.status(200).json({ message: "User updated successfully." });
        } catch (error) {
          console.error("Error updating user:", error);
          res.status(500).json({ error: "Failed to update user." });
        }
      };
}

export default userManagmentController;