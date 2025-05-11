# Nodejs Task

A Node.js REST API application built with Express.js, JWT authentication, JOI for validation, and Prisma for database operations.


## Prerequisites

- Node.js
- npm or yarn

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd Nodejs_Task
   ```

3. Install dependencies:
   ```
   npm install
   ```

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