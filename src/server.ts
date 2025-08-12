import app from './app';
import { pool } from './config/database';

const PORT = process.env.PORT || 8080;

pool.connect((err, client, release) => {
    if (err) {
        console.error('Error connecting to PostgreSQL:', err);
        return;
    }
    console.log('Connected to PostgreSQL successfully!');
    release();
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});