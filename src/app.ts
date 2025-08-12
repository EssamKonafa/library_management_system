import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middlewares
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Node.js + TypeScript + PostgreSQL API!' });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

export default app;