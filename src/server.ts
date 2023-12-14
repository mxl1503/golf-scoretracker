import express, { json, Request, Response } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import errorhandler from 'errorhandler';

const app = express();

app.use(errorhandler());
app.use(cors());
app.use(morgan('dev'));
app.use(json());

const PORT: number = parseInt(process.env.PORT) || 12345;
const HOST: string = process.env.IP || 'localhost';

app.get('/', function (req: Request, res: Response) {
  res.json({ msg: 'Hello World' });
});

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

const server = app.listen(PORT, HOST, () => { console.log(`Server is listening on port ${PORT}.`); });

process.on('SIGINT', () => {
  server.close(() => { console.log('Shutting down server.'); });
});
