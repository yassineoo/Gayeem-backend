import { Request, Response } from "express";
import DeviceService from "../device";

class devicesControllers {

    static async getRooms(req: Request, res: Response) {
        
        try {
          const requesterId =Number( req.params.id); // Assuming the requesterId is passed as a parameter
    
          const rooms = await DeviceService.getRooms(requesterId);
    
          res.json(rooms);
        } catch (error) {
          console.error("Error fetching rooms:", error);
          res.status(500).json({ error: "Failed to fetch rooms." });
        }
      }
    static async addRoom(req: Request, res: Response) {
        try {
          console.log("yo hoh ohoh");
          
          const requesterId = Number( req.user.id); ; // Assuming the requesterId is passed as a query parameter
          const data = req.body; // Assuming the room name is passed in the request body
    
          const room = await DeviceService.addRoom(Number(requesterId), data);
    
          res.json(room);
        } catch (error) {
          console.error("Error adding room:", error);
          res.status(500).json({ error: "Failed to add room." });
        }
      }
    
}

export default devicesControllers;