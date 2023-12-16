import express, { json, NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import errorhandler from 'errorhandler';
import { connectDatabase } from './database/connect';
import {
  registerNewUser,
  loginUser,
  getUserDetails,
} from './auth';

require('./database/connect');
require('dotenv').config();

const jwt = require('jsonwebtoken');

const start = async () => {
  try {
    await connectDatabase(String(process.env.MONGO_URI));

    app.listen(PORT, HOST, () => {
      console.log(`Server is listening on port ${PORT}.`);
    });
  } catch (error) {
    console.log(error);
  }
};

export interface IdObject {
  id: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: IdObject;
    }
  }
}

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err: any, user: any) => {
    if (err) return res.sendStatus(403); // Invalid token
    req.user = user;
    next();
  });
};

const app = express();

app.use(errorhandler());
app.use(cors());
app.use(morgan('dev'));
app.use(json());

const PORT: number = parseInt(process.env.PORT) || 12345;
const HOST: string = process.env.IP || 'localhost';

start();

app.get('/', function (req: Request, res: Response) {
  res.json({ msg: 'Hello World' });
});

app.post('/admin/auth/register', async (req: Request, res: Response) => {
  try {
    const { email, password, nameFirst, nameLast } = req.body;
    const token = await registerNewUser(email, password, nameFirst, nameLast);

    return res.json({ token });
  } catch (error) {

    return res.status(error.status || 500).json({ message: error.message || 'Internal Server Error' });
  }
});

app.post('/admin/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const token = await loginUser(email, password);

    return res.json({ token });
  } catch (error) {

    return res.status(error.status || 500).json({ message: error.message || 'Internal Server Error' });
  }
});

app.get('/admin/user/details', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    const details = await getUserDetails(userId);
    return res.json({ details });
  } catch (error) {

    return res.status(error.status || 500).json({ message: error.message || 'Internal Server Error' });
  }
});

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

app.use((req: Request, res: Response) => {
  const error = `
    404 Not found - This could be because:
    0. You have defined routes below (not above) this middleware in server.ts
    1. You have not implemented the route ${req.method} ${req.path}
    2. There is a typo in either your test or server, e.g. /posts/list in one
        and, incorrectly, /post/list in the other
    3. You are using ts-node (instead of ts-node-dev) to start your server and
        have forgotten to manually restart to load the new changes
    4. You've forgotten a leading slash (/), e.g. you have posts/list instead
        of /posts/list in your server.ts or test file`;

  res.status(404).json({ error });
});
