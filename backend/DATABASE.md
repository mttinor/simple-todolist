# SQLite Database Information

## Database Location

The SQLite database file is located at:
```
/home/mehdi/Downloads/simple-todolist/backend/todo.db
```

## Database Creation

The database is automatically created when you first run the backend server:
```bash
cd backend
npm run start:dev
```

TypeORM will automatically:
- Create the database file if it doesn't exist
- Create all tables based on the entities
- Set up relationships between tables

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE,
  password TEXT,
  isAnonymous INTEGER DEFAULT 0,
  createdAt DATETIME,
  updatedAt DATETIME
);
```

### Todos Table
```sql
CREATE TABLE todos (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  completed INTEGER DEFAULT 0,
  dueDate INTEGER,
  isRecurring INTEGER DEFAULT 0,
  recurringType TEXT,
  recurringDays TEXT,  -- JSON array: [0,1,2,3,4,5,6]
  completedDates TEXT,  -- JSON array: [timestamp1, timestamp2, ...]
  userId TEXT NOT NULL,
  createdAt DATETIME,
  updatedAt DATETIME,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);
```

## Viewing the Database

### Using SQLite CLI
```bash
cd backend
sqlite3 todo.db

# List all tables
.tables

# View users
SELECT * FROM users;

# View todos
SELECT * FROM todos;

# View todos with user email
SELECT t.*, u.email 
FROM todos t 
LEFT JOIN users u ON t.userId = u.id;

# Exit
.quit
```

### Using VS Code
Install the "SQLite Viewer" extension, then:
1. Open the `todo.db` file in VS Code
2. The extension will show the database structure and data

### Using Online Tools
1. Upload `backend/todo.db` to https://sqliteviewer.app/
2. Browse tables and run queries

## Database Backup

To backup the database:
```bash
cd backend
cp todo.db todo.db.backup
```

To restore:
```bash
cd backend
cp todo.db.backup todo.db
```

## Notes

- The database file is in the `.gitignore` by default
- `synchronize: true` in TypeORM means schema changes will auto-apply (development only)
- In production, set `synchronize: false` and use migrations

