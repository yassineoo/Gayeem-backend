
import { v4 as uuidv4 } from 'uuid';
import prisma from "../../prisma/dbConnection"
import bcrypt from "bcryptjs";
import * as nodemailer from 'nodemailer';

class UserManagementService {

    static delete = async (requesterId: number, userId: number, nextMaster?: number) => {
        try {
          const requester = await prisma.users.findUnique({ where: { id: requesterId } });
    
          if (!requester) {
            throw new Error("Requester not found.");
          }
    
          if (requester.role === "slave" && requesterId === userId) {
            // Requester is a slave and trying to delete themselves
            await prisma.invitations.deleteMany({ where: {slave_user_id: userId } });
            await prisma.users.delete({ where: { id: userId } });
          } else if (requester.role === "master") {
            const user = await prisma.users.findUnique({ where: { id: userId } });
    
            if (!user) {
              throw new Error("User not found.");
            }
    
            if (userId === requesterId) {
              // Requester is a master and trying to delete themselves
              if (!nextMaster) {
                throw new Error("No next master provided.");
              }
    
              await prisma.users.update({
                where: { id: requesterId },
                data: { role: "master", idMaster: null },
              });
    
              await prisma.users.updateMany({
                where: { idMaster: requesterId },
                data: { idMaster: nextMaster },
              });
            } else if (user.idMaster === requesterId) {
              // Requester is a master and trying to delete their user
             
              await prisma.users.delete({ where: { id: userId } });
            } else {
              throw new Error("Unauthorized to delete the user.");
            }
          } else {
            throw new Error("Unauthorized to delete the user.");
          }
        } catch (error) {
          console.error("Error deleting user:", error);
          throw new Error("Failed to delete user.");
        }
      };
  
    static changeState = async (requesterId: number, state: string, userId: number) => {
        try {
          const user = await prisma.users.findUnique({ where: { id: userId } });
    
          if (!user) {
            throw new Error("User not found.");
          }
    
          if (requesterId === userId) {
            // Requester is the same as the user, allow state modification
            await prisma.users.update({ where: { id: userId }, data: { state } });
          } else {
            const requester = await prisma.users.findUnique({ where: { id: requesterId } });
    
            if (!requester) {
              throw new Error("Requester not found.");
            }
    
            if (requester.role === "master" && user.idMaster === requesterId) {
              // Requester is a master of the user, allow state modification
              await prisma.users.update({ where: { id: userId }, data: { state } });
            } else {
              throw new Error("Unauthorized to modify user's state.");
            }
          }
        } catch (error) {
          console.error("Error changing user's state:", error);
          throw new Error("Failed to change user's state.");
        }
      };
    static getMyUsers = async (idMaster: number) => {
        try {
          const users = await prisma.users.findMany({
            where: {
              idMaster: idMaster,
            },
          });
    
          return users;
        } catch (error) {
          console.error("Error retrieving users:", error);
          throw new Error("Failed to retrieve users.");
        }
      };
    
   

      static modifey = async (userId: number, data: any) => {
        try {
          // Check if the user exists
          const user = await prisma.users.findUnique({ where: { id: userId } });
          if (!user) {
            throw new Error('User not found.');
          }
      
          // Verify the password
          const passwordMatch = await bcrypt.compare(data.password, user.password);
          if (!passwordMatch) {
            throw new Error('Incorrect password.');
          }
      
          // Update the user's profile information
          const username = data.username || user.username;
          const email = data.email || user.email;
          const newPassword = data.newPassword ? await bcrypt.hash(data.newPassword, 10) : user.password;
      
          await prisma.users.update({
            where: { id: userId },
            data: {
              username,
              email,
              password: newPassword,
            },
          });
      
          // Return success message or updated user data
          return 'Profile updated successfully';
        } catch (error) {
          console.error('Error modifying user:', error);
          throw new Error('Failed to modify user.');
        }
      };
      

    static changePassword = async ( userId: number, password: string ) => {
        try {
          const hashedPassword = await bcrypt.hash(password, 10);
          await prisma.users.update({ where: { id: userId }, data: { password :hashedPassword   } });
        } catch (error) {
          console.error("Error changing password:", error);
          throw new Error("Failed to change password.");
        }
      }

// Generate a unique invitation code
  static generateInvitationCode(): string {
  return uuidv4().substr(0, 8); // Generate a UUID and take the first 8 characters as the invitation code
 }
      
  static createInvitation = async (masterUserId: number, userEmail:String): Promise<string> => {
    try {
      const invitationCode = this.generateInvitationCode();

      const newInvitation = await prisma.invitations.create({
        data: {
          invitation_code:invitationCode,
          master_user_id :masterUserId,
    
        },
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
    to: userEmail, // list of receivers
    subject: "Invitation ", // Subject line
    html: `
    <p>Hello , You have been invited to join the GAYEEM Family here is your invitaion code ${newInvitation.invitation_code} if u are not the one who did this pleas tell us 
     </p>
    `, // HTML body
  });
  
  console.log(`Message sent: ${info.messageId}`);
      return newInvitation.invitation_code;
    } catch (error) {
      console.error('Error creating invitation:', error);
      throw new Error('Failed to create invitation');
    }
  };

    

  // Function to create a new issue
static createIssue= async (complaintText: string, userId: number) => {
  try {
    const createdIssue = await prisma.issues.create({
      data: {
        complaint_text : complaintText,
        user_id: userId },
      },
    );
  return createdIssue;

  
    
  } catch (error) {
    throw new Error('Failed to create issue.');
    
  }

}

}

export default UserManagementService;