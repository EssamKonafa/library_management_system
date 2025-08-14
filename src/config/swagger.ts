import swaggerUi from "swagger-ui-express";
import { Express } from "express";

//swagger documentation
const swaggerSpec = {
    openapi: "3.0.0",
    info: {
        title: "Library management API",
        version: "1.0.0",
        description: "API documentation for the library management system",
    },
    servers: [
        { url: "http://localhost:8080" }
    ],
    tags: [
        { name: "Auth", description: "Authentication endpoints" },
        { name: "Books", description: "Manage books" },
        { name: "Borrowers", description: "Manage borrowers" },
        { name: "Borrowing", description: "Manage borrowing process" },
    ],
    paths: {
        "/auth/signup": {
            post: {
                tags: ["Auth"],
                summary: "Register a new borrower",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/RegisterDto" },
                            examples: {
                                "User Registration": {
                                    value: {
                                        name: "John Doe",
                                        email: "john.doe@example.com",
                                        password: "password123"
                                    }
                                }
                            }
                        }
                    }
                },
                responses: {
                    201: { description: "Borrower registered successfully" },
                    500: { description: "Internal Server Error" }
                }
            }
        },
        "/auth/signin": {
            post: {
                tags: ["Auth"],
                summary: "signin borrower",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/LoginDto" },
                            examples: {
                                "User Login": {
                                    value: {
                                        email: "john.doe@example.com",
                                        password: "password123"
                                    }
                                }
                            }
                        }
                    }
                },
                responses: {
                    200: { description: "Login successful" },
                    401: { description: "Invalid credentials" },
                    500: { description: "Internal Server Error" }
                }
            }
        },

        "/book": {
            post: {
                tags: ["Books"],
                summary: "add a new book",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/CreateBookDto" },
                            examples: {
                                "Add a new book": {
                                    value: {
                                        title: "The Lord of the Rings",
                                        author: "J.R.R. Tolkien",
                                        ISBN: "978-0618053267",
                                        availableQuantity: 5,
                                        shelfLocation: "A1"
                                    }
                                }
                            }
                        }
                    }
                },
                responses: {
                    201: { description: "Book added successfully" },
                    500: { description: "Internal Server Error" }
                }
            },
            get: {
                tags: ["Books"],
                summary: "Get all books",
                parameters: [
                    {
                        name: "search",
                        in: "query",
                        required: false,
                        schema: { type: "string" },
                        description: "Search term for title, author, or ISBN"
                    },
                    {
                        name: "page",
                        in: "query",
                        required: false,
                        schema: { type: "integer", default: 1 },
                        description: "Page number"
                    },
                    {
                        name: "limit",
                        in: "query",
                        required: false,
                        schema: { type: "integer", default: 10 },
                        description: "Number of items per page"
                    }
                ],
                responses: {
                    200: { description: "List of books" },
                    500: { description: "Internal Server Error" }
                }
            }
        },
        "/book/{id}": {
            get: {
                tags: ["Books"],
                summary: "Get a book by ID",
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "string" } }
                ],
                responses: {
                    200: { description: "Book found" },
                    404: { description: "Book not found" },
                    500: { description: "Internal Server Error" }
                }
            }
            , patch: {
                tags: ["Books"],
                summary: "Update a book",
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "string" } }
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/UpdateBookDto" },
                            examples: {
                                "Update a book": {
                                    value: {
                                        title: "The Hobbit",
                                        author: "J.R.R. Tolkien",
                                        ISBN: "978-0618053267",
                                        availableQuantity: 5,
                                        shelfLocation: "A1"
                                    }
                                }
                            }
                        }
                    }
                },
                responses: {
                    200: { description: "Book updated successfully" },
                    404: { description: "Book not found" },
                    500: { description: "Internal Server Error" }
                }
            },
            delete: {
                tags: ["Books"],
                summary: "Delete a book",
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "string" } }
                ],
                responses: {
                    200: { description: "Book deleted successfully" }
                }
            }
        },

        "/borrower": {
            get: {
                tags: ["Borrowers"],
                summary: "Get all borrowers",
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: "page",
                        in: "query",
                        required: false,
                        schema: { type: "integer", default: 1 },
                        description: "Page number"
                    },
                    {
                        name: "limit",
                        in: "query",
                        required: false,
                        schema: { type: "integer", default: 10 },
                        description: "Number of items per page"
                    }
                ],
                responses: {
                    200: { description: "List of borrowers" },
                    500: { description: "Internal Server Error" }
                }
            },
        },
        "/borrower/{id}": {
            get: {
                tags: ["Borrowers"],
                summary: "Get a borrower by ID",
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "string" } }
                ],
                security: [{ bearerAuth: [] }],
                responses: {
                    200: { description: "Borrower found" },
                    404: { description: "Borrower not found" },
                    500: { description: "Internal Server Error" }
                }
            },
            patch: {
                tags: ["Borrowers"],
                summary: "Update a borrower",
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "string" } }
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/UpdateBorrowerDto" },
                            examples: {
                                "Update a borrower": {
                                    value: {
                                        name: "John Doe",
                                        email: "john.doe@example.com"
                                    }
                                }
                            }
                        }
                    }
                },
                responses: {
                    200: { description: "Borrower updated successfully" },
                    404: { description: "Borrower not found" },
                    500: { description: "Internal Server Error" }
                }
            },
            delete: {
                tags: ["Borrowers"],
                summary: "Delete a borrower",
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "string" } }
                ],
                security: [{ bearerAuth: [] }],
                responses: {
                    200: { description: "Borrower deleted successfully" },
                    500: { description: "Internal Server Error" },
                }
            }
        },

        "/borrowing/checkout": {
            post: {
                tags: ["Borrowing"],
                summary: "Create borrowing record",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/CreateBorrowingDto" },
                            examples: {
                                "Borrow a book": {
                                    value: {
                                        borrower: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
                                        book: "f0e9d8c7-b6a5-4321-fedc-ba9876543210",
                                        dueDate: "2025-12-31"
                                    }
                                }
                            }
                        }
                    }
                },
                responses: {
                    201: { description: "Borrowing record created successfully" },
                    400: { description: "Bad Request" },
                    404: { description: "Book or Borrower not found" },
                    500: { description: "Internal Server Error" }
                }
            }
        },
        "/borrowing/return": {
            patch: {
                tags: ["Borrowing"],
                summary: "Return a borrowed book",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    borrowerId: { type: "string", format: "uuid" },
                                    bookId: { type: "string", format: "uuid" }
                                },
                                required: ["borrowerId", "bookId"]
                            },
                            examples: {
                                "Return a book": {
                                    value: {
                                        borrowerId: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
                                        bookId: "f0e9d8c7-b6a5-4321-fedc-ba9876543210"
                                    }
                                }
                            }
                        }
                    }
                },
                responses: {
                    200: { description: "Book returned successfully" },
                    400: { description: "Bad Request" },
                    404: { description: "Borrowed book not found" },
                    500: { description: "Internal Server Error" }
                }
            }
        },

        "/borrowing": {
            get: {
                tags: ["Borrowing"],
                summary: "Get all borrowed books",
                parameters: [
                    {
                        name: "page",
                        in: "query",
                        required: false,
                        schema: { type: "integer", default: 1 },
                        description: "Page number"
                    },
                    {
                        name: "limit",
                        in: "query",
                        required: false,
                        schema: { type: "integer", default: 10 },
                        description: "Number of items per page"
                    }
                ],
                responses: {
                    200: { description: "List of borrowed books" },
                    500: { description: "Internal Server Error" }
                }
            }
        },
        "/borrowing/overdue": {
            get: {
                tags: ["Borrowing"],
                summary: "Get all overdue borrowed books",
                parameters: [
                    {
                        name: "page",
                        in: "query",
                        required: false,
                        schema: { type: "integer", default: 1 },
                        description: "Page number"
                    },
                    {
                        name: "limit",
                        in: "query",
                        required: false,
                        schema: { type: "integer", default: 10 },
                        description: "Number of items per page"
                    }
                ],
                responses: {
                    200: { description: "List of overdue borrowed books" },
                    500: { description: "Internal Server Error" }
                }
            }
        },
        "/borrowing/report": {
            get: {
                tags: ["Borrowing"],
                summary: "Download borrowing report",
                parameters: [
                    {
                        name: "startDate",
                        in: "query",
                        required: true,
                        schema: { type: "string", format: "date" },
                        description: "Start date for the report (YYYY-MM-DD)"
                    },
                    {
                        name: "endDate",
                        in: "query",
                        required: true,
                        schema: { type: "string", format: "date" },
                        description: "End date for the report (YYYY-MM-DD)"
                    }
                ],
                responses: {
                    200: { description: "Excel file with borrowing report", },
                    400: { description: "Bad Request - Missing start or end date" },
                    500: { description: "Internal Server Error" }
                }
            }
        },
        "/borrowing/overdue-last-month": {
            get: {
                tags: ["Borrowing"],
                summary: "Download report of overdue borrows from last month",
                responses: {
                    200: { description: "Excel file with overdue borrows from last month", },
                    500: { description: "Internal Server Error" }
                }
            }
        },
        "/borrowing/all-borrows-last-month": {
            get: {
                tags: ["Borrowing"],
                summary: "Download report of all borrows from last month",
                responses: {
                    200: { description: "Excel file with all borrows from last month", },
                    500: { description: "Internal Server Error" }
                }
            }
        },
        "/borrowing/borrower/{borrowerId}": {
            get: {
                tags: ["Borrowing"],
                summary: "Get borrowed books by borrower ID",
                parameters: [
                    {
                        name: "borrowerId",
                        in: "path",
                        required: true,
                        schema: { type: "string", format: "uuid" },
                        description: "ID of the borrower"
                    },
                    {
                        name: "page",
                        in: "query",
                        required: false,
                        schema: { type: "integer", default: 1 },
                        description: "Page number"
                    },
                    {
                        name: "limit",
                        in: "query",
                        required: false,
                        schema: { type: "integer", default: 10 },
                        description: "Number of items per page"
                    }
                ],
                responses: {
                    200: { description: "List of borrowed books for the specified borrower" },
                    500: { description: "Internal Server Error" }
                }
            }
        }
    },

    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT"
            }
        },
        schemas: {
            RegisterDto: {
                type: "object",
                required: ["name", "email", "password"],
                properties: {
                    name: { type: "string" },
                    email: { type: "string", format: "email" },
                    password: { type: "string", minLength: 6 }
                }
            },
            LoginDto: {
                type: "object",
                required: ["email", "password"],
                properties: {
                    email: { type: "string", format: "email" },
                    password: { type: "string" }
                }
            },
            CreateBookDto: {
                type: "object",
                required: ["title", "author"],
                properties: {
                    title: { type: "string", maxLength: 150 },
                    author: { type: "string", maxLength: 100 },
                    ISBN: { type: "string", maxLength: 13 },
                    availableQuantity: { type: "integer" },
                    shelfLocation: { type: "string", maxLength: 100 }
                }
            },
            UpdateBookDto: {
                type: "object",
                properties: {
                    title: { type: "string", maxLength: 150 },
                    author: { type: "string", maxLength: 100 },
                    ISBN: { type: "string", maxLength: 13 },
                    availableQuantity: { type: "integer" },
                    shelfLocation: { type: "string", maxLength: 100 }
                }
            },
            CreateBorrowerDto: {
                type: "object",
                required: ["name", "email"],
                properties: {
                    name: { type: "string", maxLength: 100 },
                    email: { type: "string", format: "email" }
                }
            },
            UpdateBorrowerDto: {
                type: "object",
                properties: {
                    name: { type: "string", maxLength: 100 },
                    email: { type: "string", format: "email" },
                }
            },
            CreateBorrowingDto: {
                type: "object",
                required: ['borrower', 'book', 'dueDate'],
                properties: {
                    borrower: { type: "string", format: "uuid" },
                    book: { type: "string", format: "uuid" },
                    dueDate: { type: "string", format: "date" },
                }
            },
            UpdateBorrowingDto: {
                type: "object",
                properties: {
                    borrower: { type: "string", format: "uuid" },
                    book: { type: "string", format: "uuid" },
                    status: { type: "string", enum: ["borrowed", "returned", "overdue"] },
                    dueDate: { type: "string", format: "date" },
                    returnedAt: { type: "string", format: "date" }
                }
            }
        }
    }
};

export function setupSwagger(app: Express) {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
