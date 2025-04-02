import express from "express";
import cors from "cors";
import path from 'path';
import 'dotenv/config'
import helmet from 'helmet';

import screenshotRouter from './routes/screenshot.route.js'

const app = express();
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'", "*"],
                imgSrc: ["'self'", "data:", "*"],
                scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "*"],
                styleSrc: ["'self'", "'unsafe-inline'", "*"],
                connectSrc: ["'self'", "*"],
            },
        },
    })
);


app.use("/api", screenshotRouter);

const __dirname = path.resolve();

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend', 'dist', 'index.html'));
    })
}

const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));