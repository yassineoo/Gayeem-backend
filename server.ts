import dotenv from 'dotenv';
import express ,{Request ,Response} from 'express';
import cors from 'cors'
import  authentficationRoutes from './services/service-authentification/routes/auth.Route'
import  userManagementRoutes from './services/service-user-managment/routes/user-management.route';
import  devicesRoutes from './services/service-devices/routes/routes';
const app = express();
app.use(cors());
app.use(express.json())
app.get('/', (req : Request, res : Response) => {
    res.send('Hello here is the entry point');
});

app.use('/api/user-management', userManagementRoutes);
app.use('/api/auth',authentficationRoutes );
app.use('/api/devices',devicesRoutes );
const port = 5000;


const server = app.listen(port, () => {
    console.log(`Express server listening on port ${port}`);
  });