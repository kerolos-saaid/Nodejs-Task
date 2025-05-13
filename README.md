# Nodejs Task

A Node.js REST API application built with Express.js, JWT authentication, JOI for validation, and Prisma for database operations.


## Prerequisites

- Node.js
- npm or yarn

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/kerolos-saaid/Nodejs-Task
   ```

2. Navigate to the project directory:
   ```
   cd Nodejs_Task
   ```

3. Install dependencies:
   ```
   npm install
   ```

## Prisma Setup

This project uses Prisma as its ORM. The Prisma schema is located at `src/prisma/schema.prisma`.

**Important:** To run Prisma commands correctly, you must first navigate to the `src` directory:
```bash
cd src
```

**Common Prisma Commands (run from `./src/` directory):**

1.  **Generate Prisma Client:**
    After any changes to the `schema.prisma` file, regenerate the Prisma Client:
    ```bash
    npx prisma generate
    ```

2.  **Create a new migration:**
    When you make changes to your database schema (in `schema.prisma`), create a new migration file:
    ```bash
    npx prisma migrate dev --name your-migration-name
    ```
    Replace `your-migration-name` with a descriptive name for your migration (e.g., `add-user-email-unique-constraint`).

3.  **Apply migrations:**
    To apply pending migrations to your database:
    ```bash
    npx prisma migrate deploy
    ```

4.  **Open Prisma Studio:**
    Prisma Studio is a GUI to view and manage your data:
    ```bash
    npx prisma studio
    ```
    This will typically open in your browser at `http://localhost:5555`.

Remember to navigate back out of the `src` directory (`cd ..`) when you are done running Prisma commands if you need to run project-level commands (like `npm run dev`).

## Running the Application

## Attribute-Based Access Control (ABAC)

This project uses an Attribute-Based Access Control (ABAC) system for authorization.

**Key Files:**
*   `src/modules/Auth/AccessControl/permissions.js`: Defines available permissions (e.g., `CREATE_POST`).
*   `src/modules/Auth/AccessControl/roles.js`: Defines user roles (e.g., `ADMIN`, `USER`).
*   `src/modules/Auth/AccessControl/rolesPermissions.js`: Maps roles to their granted permissions.
*   `src/middlewares/hasPermission.js`: The middleware that enforces permissions on routes.

**How it Works:**
1.  The `auth()` middleware (or equivalent) authenticates the user and attaches their permissions (derived from their role) to `req.user.permissions`.
2.  The `hasPermission([PERMISSION_NAME])` middleware is added to routes. It checks if `req.user.permissions` includes the required permission.
3.  Access is granted if the permission exists, otherwise a 401 Unauthorized error is returned.

**Usage Example (from `src/modules/Post/post.route.js`):**
```javascript
import auth from "../../middlewares/auth.js";
import hasPermission from "../../middlewares/hasPermission.js";
import PERMISSIONS from "../Auth/AccessControl/permissions.js";
// ... other imports

// Protect route: only users with 'CREATE_POST' permission can access
router.post(
  "/create",
  // ... other middlewares like validation
  auth(),
  hasPermission([PERMISSIONS.CREATE_POST]),
  postController.createPost
);
```
The `auth()` middleware must run before `hasPermission`.

## Running the Application

### Development Mode

Run the application with auto-reload using nodemon:

```
npm run dev
```

### Production Mode

Start the application:

```
npm start
```

### Using PM2 (Production)

You can use PM2 to manage the application in production:

```
npx pm2 start ./src/main.js --name "node-task"
```

Monitor the application:

```
npx pm2 monit
```

## API Endpoints

- GET `/`: Hello World endpoint

## License

ISC
