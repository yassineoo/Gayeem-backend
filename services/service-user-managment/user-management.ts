

import prisma from "../../prisma/dbConnection"
import bcrypt from "bcryptjs";
class UserManagementService {

    static delete = async (requesterId: number, userId: number, nextMaster?: number) => {
        try {
          const requester = await prisma.users.findUnique({ where: { id: requesterId } });
    
          if (!requester) {
            throw new Error("Requester not found.");
          }
    
          if (requester.role === "slave" && requesterId === userId) {
            // Requester is a slave and trying to delete themselves
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
    
   
    static modifey = async (requesterId: number, userId: number, data: any) => {
        try {
          if (requesterId === userId) {
            // Requester is the same as the user, allow modification
            await prisma.users.update({ where: { id: userId }, data });
          } else {
            throw new Error("Unauthorized to modify the user.");
          }
        } catch (error) {
          console.error("Error modifying user:", error);
          throw new Error("Failed to modify user.");
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

    


}

export default UserManagementService;