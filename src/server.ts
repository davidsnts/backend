import cors from 'cors';
import "dotenv/config";
import express, { Request, Response, NextFunction } from 'express';

const app = express();

app.use(express.json());
app.use(cors());
const PORT = process.env.PORT! || 3333;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});