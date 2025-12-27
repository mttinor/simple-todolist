# Todo List Backend

NestJS backend for the Todo List application with SQLite database.

## Features

- JWT-based authentication (sign in, sign up, anonymous)
- Todo CRUD operations
- Recurring tasks support (daily/weekly)
- Date-based filtering
- SQLite database

## Installation

```bash
npm install
```

## Running the app

```bash
# development
npm run start:dev

# production mode
npm run build
npm run start:prod
```

## API Endpoints

### Authentication

- `POST /auth/signin` - Sign in, sign up, or sign in anonymously
  - Body: `{ email?, password?, flow?: 'signIn' | 'signUp' }`
  - Returns: `{ access_token, user }`

- `GET /auth/me` - Get current user (requires authentication)
  - Headers: `Authorization: Bearer <token>`
  - Returns: `{ id, email, isAnonymous }`

### Todos

- `POST /todos` - Create a new todo (requires authentication)
  - Body: `{ title, description?, dueDate?, isRecurring?, recurringType?, recurringDays? }`
  - Returns: Todo object

- `GET /todos/for-date?date=<timestamp>` - Get todos for a specific date (requires authentication)
  - Returns: Array of Todo objects

- `POST /todos/toggle` - Toggle todo completion (requires authentication)
  - Body: `{ todoId, date? }`
  - Returns: Updated Todo object

- `DELETE /todos/:id` - Delete a todo (requires authentication)
  - Returns: Success message

## Database

The SQLite database file (`todo.db`) will be created automatically in the backend directory when you first run the application.

## Environment Variables

- `JWT_SECRET` - Secret key for JWT tokens (default: 'your-secret-key-change-in-production')
- `PORT` - Server port (default: 3001)

