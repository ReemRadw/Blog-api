# Blog API Backend (NestJS)

A simple yet robust Blog API built with NestJS and TypeScript, featuring CRUD operations for blog posts, secure user authentication with JWT, and admin-specific functionality.

---

## Features

- **Blog Post Management (CRUD)**
  - Create, read, update, and delete blog posts
  - Pagination support for listing posts
  - Role-based access: users manage their own posts, admins can manage any post
- **User Authentication (JWT)**
  - Register and login endpoints
  - Password hashing with bcrypt
  - JSON Web Token (JWT) for protecting routes
- **Admin-Specific Actions**
  - View all registered users (excluding passwords)
  - Admins can update or delete any post
- **Database Agnostic**
  - Supports mysql via prisma
- **Seed Data**
  - Seed initial data for development

---

## Tech Stack

- **Framework:** NestJS
- **Language:** TypeScript
- **Database:** mysql
- **ORM/ODM:** prisma
- **Authentication:** JWT
- **Environment Config:** dotenv

---

## Prerequisites

- Node.js >= 16.x
- npm or Yarn
---

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/ReemRadw/Blog-api.git
   cd Blog-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   - Copy the example file and fill in with your values:
     ```bash
     cp .env.example .env
     ```
   - Required variables:
     ```dotenv
     DATABASE_URL=mysql://root@localhost:3306/blog_db
     JWT_SECRET=supersecretkey123
     JWT_EXPIRES_IN=1h
     ```

4. **Database migrations & seeding**
   - Run migrations (if using TypeORM):
     ```bash
     npm run typeorm:migration:run
     ```
   - Seed initial data:
     ```bash
     npm run seed
     ```

5. **Start the application**
   ```bash
   npm run start:dev
   ```
   The API will be available at `http://localhost:3000` by default.

---

## Scripts

| Script                    | Description                                  |
|---------------------------|----------------------------------------------|
| `npm run start`           | Run the app in production mode               |
| `npm run start:dev`       | Run the app in development mode (watch)      |
| `npm run build`           | Build the project                            |
| `npm run seed`            | Seed the database with initial data          |
| `npm run typeorm:generate`| Generate a new TypeORM migration             |
| `npm run typeorm:run`     | Run pending TypeORM migrations               |
| `npm run test`            | Run unit tests                               |  

---

## Environment Variables (.env.example)

```dotenv
# Server
PORT=3000

# Database (prisma )
DATABASE_URL=mysql://root@localhost:3000/blog_db

# JWT
JWT_SECRET=supersecretkey123
JWT_EXPIRES_IN=1h
```  

---

## API Endpoints

### Auth

| Method | Endpoint           | Description               | Access   |
|--------|--------------------|---------------------------|----------|
| POST   | `/auth/register`   | Register a new user       | Public   |
| POST   | `/auth/login`      | User login (get JWT)      | Public   |

### Posts

| Method  | Endpoint          | Description                          | Access                      |
|---------|-------------------|--------------------------------------|-----------------------------|
| POST    | `/posts`          | Create a new blog post               | Authenticated users        |
| GET     | `/posts`          | Retrieve all posts (with pagination) | Public                      |
| GET     | `/posts/:id`      | Retrieve a single post by ID         | Public                      |
| PATCH   | `/posts/:id`      | Update your post (admin any post)    | Authenticated users / Admin |
| DELETE  | `/posts/:id`      | Delete your post (admin any post)    | Authenticated users / Admin |

### Admin

| Method | Endpoint           | Description                     | Access   |
|--------|--------------------|---------------------------------|----------|
| GET    | `/admin/users`     | List all registered users       | Admin    |

---

## Postman Collection

Import the provided `Blog-api.postman_collection.json` file in postman folder to test all endpoints with predefined requests and environments.

---


