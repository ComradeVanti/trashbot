import express from "express";

const port = 3000

const app = express()

app.get('/ping', (req, res) => {
    res.send('pong');
});

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
