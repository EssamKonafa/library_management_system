import express from 'express';
import dotenv from 'dotenv';
import bookRoutes from './modules/book/book.route';
import { setupSwagger } from './config/swagger';
import { errorHandler } from './middlewares/error-handler.middleware';
import { wrongEndPoint } from './middlewares/wrong-endpoint.middleware';
import borrowerRoutes from './modules/borrower/borrower.route';
import borrowingRoutes from './modules/borrowing/borrowing.route';
import authRoutes from './modules/auth/auth.route';

dotenv.config();

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
setupSwagger(app);

// Routes
app.use('/auth', authRoutes);
app.use('/book', bookRoutes);
app.use('/borrower', borrowerRoutes);
app.use('/borrowing', borrowingRoutes)


app.use(errorHandler)
app.use(wrongEndPoint)

export default app;