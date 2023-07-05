import  prisma  from '../../prisma/dbConnection' ;

class DeviceService {

    static  async getRooms(requesterId: number) {
        try {
          const requester = await prisma.users.findUnique({ where: { id: requesterId } });
    
          if (!requester) {
            throw new Error("Requester not found.");
          }
    
          let rooms ;
    
          if (requester.role === "master") {
            // Requester is a master, get rooms where room.userId = requesterId
            rooms = await prisma.room.findMany({ where: { idUser: requesterId } });
          } else if (requester.role === "slave" && requester.idMaster) {
            // Requester is a slave, get rooms of his master
            rooms = await prisma.room.findMany({ where: { idUser: requester.idMaster } });
          } else {
            throw new Error("Unauthorized to access rooms.");
          }
    
          return rooms;
        } catch (error) {
          console.error("Error fetching rooms:", error);
          throw new Error("Failed to fetch rooms.");
        }
      }
      static async addRoom(requesterId: number, data) {
        try {
          const requester = await prisma.users.findUnique({ where: { id: requesterId } });
    
          if (!requester) {
            throw new Error("Requester not found.");
          }
    
          if (requester.role !== "master") {
            throw new Error("Unauthorized to add rooms.");
          }
    
          const room = await prisma.room.create({
            data: {
              ...data,
              idUser: requesterId,

            },
          });
    
          return room;
        } catch (error) {
          console.error("Error adding room:", error);
          throw new Error("Failed to add room.");
        }
      }
}
export default DeviceService;