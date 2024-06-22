import 'dotenv/config';
import express from 'express';
import globalRouter from './global-router';
import { logger } from './logger';
import http from 'http';
import { wss } from './roadmap/roadmap.router';
import connectDB from './db';
import cors from "cors"

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(logger);
app.use(express.json());
app.use(cors());
app.use('/api/v1/', globalRouter);

const server = http.createServer(app);

server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });

});

server.listen(PORT, () => { 
  console.log(`Server runs at http://localhost:${PORT}`);
});
