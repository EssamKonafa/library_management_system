import { AppDataSource } from "../config/database";
import { faker } from "@faker-js/faker";
import { Book } from "../modules/book/book.entity";

//seeder file to insert collection of dummy books

const NUM_RECORDS = 50;

export async function seedBooksIfEmpty() {
    const repository = AppDataSource.getRepository(Book);

    const count = await repository.count();
    if (count > 0) {
        return;
    }

    console.log("Seeding books");

    const books: Partial<Book>[] = [];

    for (let i = 0; i < NUM_RECORDS; i++) {
        books.push({
            title: faker.lorem.sentence(3),
            author: faker.person.fullName(),
            ISBN: faker.string.alphanumeric({ length: 13 }),
            availableQuantity: faker.number.int({ min: 0, max: 20 }),
            shelfLocation: `Shelf-${faker.number.int({ min: 1, max: 10 })}`,
        });
    }

    await repository.save(books);

    console.log('books seeded successfully.');
}
