import { DataSource } from "typeorm";
import { Book } from "../modules/book/book.entity";
import { Borrower } from "../modules/borrower/borrower.entity";
import { BorrowedBook } from "../modules/borrowing/borrowing.entity";

//assuring first instance of database are exist, to avoid any errors of database are not found

export const AppDataSource = new DataSource({
    type: process.env.DB_TYPE as any || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    username: process.env.DB_USER_NAME || 'postgres',
    password: 'postgres',
    database: process.env.DB_NAME || 'library_management_system',
    entities: [Book, Borrower, BorrowedBook],
    port: Number(process.env.DB_PORT) || 5432,
    synchronize: true,
});

export async function createDatabaseIfNotExists() {

    const tempDataSource = new DataSource({
        type: process.env.DB_TYPE as any || 'postgres',
        host: process.env.DB_HOST || 'localhost',
        username: 'postgres',
        password: 'postgres',
        database: process.env.DB_DEFAULT || 'postgres',
        port: 5432,
    });

    try {
        await tempDataSource.initialize();

        const result = await tempDataSource.query(
            "SELECT 1 FROM pg_database WHERE datname = 'library_management_system'"
        );

        // If database doesn't exist, create it
        if (result.length === 0) {
            await tempDataSource.query('CREATE DATABASE library_management_system');
            console.log('Database library_management_system created successfully');
        }
        await tempDataSource.destroy();
    } catch (error) {
        console.error('Error creating database:', error);
        await tempDataSource.destroy();
        throw error;
    }
}