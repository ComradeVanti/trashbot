import express from "express";
import {createServer} from "http";
import {Server} from "socket.io"

const port = 3000

const app = express()
const httpServer = createServer(app);
const io = new Server(httpServer)

app.get('/ping', (req, res) => {
    res.send('pong');
});

io.on("connection", socket => {
})

httpServer.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
