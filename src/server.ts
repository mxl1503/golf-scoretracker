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
import {
  getRoundsList,
} from './round';

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
  // For some reason not using american spelling breaks typesafety???
  
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err: any, user: any) => {
    // Invalid token
    if (err) return res.sendStatus(403);
    
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

app.get('/admin/rounds/list', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    const rounds = await getRoundsList(userId);
    return res.json({ rounds });
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message || 'Internal Server Error' });
  }
});

/// ////////////////////////////////////////////////////////////////////////////
/// ////////////////////////////////////////////////////////////////////////////
/// ////////////////////////////////////////////////////////////////////////////

app.use((req: Request, res: Response) => {
  const error = '404 Not found';

  res.status(404).json({ error });
});
