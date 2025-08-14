## Library Management System

### Overview

This is a back-end API of a **Library Management System** built with **Node.js** , **Express** and **PostgreSQL**, providing full CRUD operations for managing **Books**, **Borrowers**, and **Borrowing Processes**, along with additional bonus features.

---

### Features

#### Functional Requirements

* **Books**

  * Add, update, delete, and list books.
  * Search by title, author, or ISBN.
* **Borrowers**

  * Register, login, update, delete, and list borrowers.
* **Borrowing Process**

  * Borrow and return books.
  * View borrowed books per borrower.
  * Track due dates and overdue books.

---

### Bonus Features Implemented

1. **Analytical Reports**

   * Borrowing process reports for a given period.
   * Export data in **XLSX** format.
2. **Export Last Month's Overdue Borrows**.
3. **Export All Borrowing Processes of the Last Month**.
4. **Rate Limiting**

   * Applied to two specific endpoints to prevent abuse.
   * get: /borrowing
   * post: /borrowing/checkout
     
5. **Dockerized Application**

   * Fully runnable using `docker-compose`.
6. **Basic Authentication** for API access.
7. **Unit Testing**

   * Added tests for one module (**Books** module).
     *Note: There’s a minor unresolved issue due to limited time and work commitments.*

---

### Tech Stack

* **Backend**: Node.js (Express)
* **Database**: PostgreSQL (with TypeORM)
* **Testing**: Jest 
* **Containerization**: Docker & Docker Compose
* **API Documentation**: Swagger UI

---

### Database Schema

<img width="823" height="646" alt="library-management-system" src="https://github.com/user-attachments/assets/fdcd37ea-73b9-4484-b2a1-5f0d2039013b" />

---

###  Installation & Setup

#### Prerequisites

* Node.js >= 20
* Docker & Docker Compose
* PostgreSQL (if running locally without Docker)

#### Steps

```bash
# Clone the repository
git clone <repo-link>
cd library-management-system

# Install dependencies
npm install

# Run with Docker
docker-compose up --build

# Or run locally (without Docker)
npm run dev
```
## enviroment variables

PORT=8080
DB_TYPE=postgres
DB_USER=postgres
DB_NAME=library_management_system
DB_PASSWORD=postgres
DB_PORT=5432
DB_DEFAULT=postgres
JWT_SECRET=2b$10$gfOKYfxhN8ug3T3nhU8AZ
NODE_ENVIRONMENT='test'

##########################################
#for local
#DB_HOST=localhost
#DB_USER_NAME=library_management_system

#for docker
DB_HOST=db
DB_USER_NAME=postgres


---

###  API Documentation

After running the application, Swagger documentation is available at:

```
http://localhost:8080/api-docs
```

---

###  Running Tests

```bash
npm run test
```

---

###  Project Structure

```
src/
  ├── modules/
  │     ├── book/
  │     ├── borrower/
  │     ├── borrowing/
  ├── config/
  ├── middlewares/
  ├── app.ts/
  └── server.ts/
```

---

###  Known Issues

* Unit test for the Books module has a small unresolved error (time constraint).

---

---
