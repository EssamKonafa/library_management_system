import 'reflect-metadata';
import { DataSource } from "typeorm";
import { Book } from "../../../src/modules/book/book.entity";
import * as bookService from ".../../../src/modules/book/book.service";

export const testDataSource = new DataSource({
    type: "sqlite",
    database: ":memory:",
    synchronize: true,
    entities: [Book],
    dropSchema: true,
});

beforeAll(async () => {
    await testDataSource.initialize();
    (bookService as any).bookRepository = testDataSource.getRepository(Book);
});

afterAll(async () => {
    await testDataSource.destroy();
});

describe("Book Service", () => {

    it("should create a book", async () => {
        const dto = {
            title: "Test Book",
            author: "Essam",
            ISBN: "123456",
            availableQuantity: 10,
            shelfLocation: "A1"
        };
        const book = await bookService.createBook(dto);
        expect(book).toHaveProperty("id");
        expect(book.title).toBe("Test Book");
    });

    it("should find a book by ID", async () => {
        const dto = {
            title: "Another Book",
            author: "Ahmed",
            ISBN: "654321",
            availableQuantity: 5,
            shelfLocation: "B2"
        };
        const book = await bookService.createBook(dto);
        const found = await bookService.findBookById(book.id);
        expect(found.id).toBe(book.id);
        expect(found.author).toBe("Ahmed");
    });

    it("should update a book", async () => {
        const dto = {
            title: "Update Test",
            author: "Omar",
            ISBN: "987654",
            availableQuantity: 2,
            shelfLocation: "C3"
        };
        const book = await bookService.createBook(dto);
        const updated = await bookService.updateBook(book.id, { title: "Updated Title" });
        expect(updated.title).toBe("Updated Title");
    });

    it("should delete a book", async () => {
        const dto = {
            title: "Delete Test",
            author: "Ali",
            ISBN: "111222",
            availableQuantity: 1,
            shelfLocation: "D4"
        };
        const book = await bookService.createBook(dto);
        await bookService.deleteBook(book.id);
        await expect(bookService.findBookById(book.id)).rejects.toThrow("Book not found");
    });

    it("should search books", async () => {
        await bookService.createBook({ title: "Search Me", author: "Search Author", ISBN: "333444", availableQuantity: 3, shelfLocation: "E5" });
        const [books, total] = await bookService.findAllBooks("Search") as any;
        expect(total).toBeGreaterThan(0);
        expect(books[0].title).toContain("Search");
    });
});
