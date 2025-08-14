import dotenv from "dotenv";
import app from "./app";
import { AppDataSource, createDatabaseIfNotExists, } from "./config/database";
import { seedBooksIfEmpty } from "./config/book.seed";

dotenv.config();

const PORT = process.env.PORT || 8080;

async function bootstrap() {
    try {

        // await createDatabaseIfNotExists();

        await AppDataSource.initialize();
        console.log("Connected to PostgreSQL successfully");

        await seedBooksIfEmpty();

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Error starting application:", error);
        process.exit(1);
    }
}

bootstrap();
