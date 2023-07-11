import { Request, Response } from 'express';
import  UserManagementService from '../user-management'; 

class userManagmentController {
   static inviteUser = async (req: Request, res: Response)  => {
      try {
        const idMaster = req.user?.id ; // Assuming the middleware adds the id of the requester to req.user.id
        const {userEmail} = req.body
        console.log(`idMaster ---------------------`);
        console.log(idMaster);
        console.log(req.body);
        console.log(`idMaster ---------------------`);


        
        const invitaion = await UserManagementService.createInvitation(idMaster,userEmail);
        
        res.status(200).json(invitaion);
      } catch (error) {
        console.error("Error inviting the user:", error);
        res.status(500).json({ error: "Error inviting the user." });
      }
   }

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
          console.log(req.body);
          
          const { state, id } = req.body;
          console.log("requesterId",requesterId);
          console.log("state",state);
          console.log("userId",id);
          
          const user  = await UserManagementService.changeState(requesterId, state, id);
    
          res.status(200).json(user);
        } catch (error) {
          console.error("Error changing user's state:", error);
          res.status(500).json({ error: "Failed to change user's state." });
        }
      };
    static delete = async (req: Request, res: Response) => {
        try {
          const requesterId = req.user?.id ;
          const {  nextMaster } = req.body;
          const userId = Number(req.params.id)
          await UserManagementService.delete(requesterId, userId, nextMaster);
    
          res.status(200).json({ message: "User deleted successfully." });
        } catch (error) {
          console.error("Error deleting user:", error);
          res.status(500).json({ error: "Failed to delete user." });
        }
      };
      
    static createIssue = async (req: Request, res: Response) => {
        const { complaintText } = req.body;
        const userId = req.user?.id ; // Assuming the middleware adds the id of the requester to req.user.id    
        console.log(userId,' says :' ,complaintText  );
        try {
          const createdIssue = await UserManagementService.createIssue(complaintText, userId);
      
          return res.status(201).json({ message: 'Issue created successfully'});
        } catch (error) {
          console.error(error);
          return res.status(500).json({ message: 'Error creating issue' });
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

          const  data  = req.body;
    
          await UserManagementService.modifey(requesterId, data);
    
          res.status(200).json({ message: "User updated successfully." });
        } catch (error) {
          console.error("Error updating user:", error);
          res.status(500).json({ error: "Failed to update user." });
        }
      };

    
}

export default userManagmentController;