# Testing the API with HTTPie

## Setup

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Create a `.env` file** (copy from `.env.example`):

   ```bash
   cp .env.example .env
   ```

3. **Update your `.env` file** with your Neon database URL:

   ```
   DATABASE_URL=your_neon_database_connection_string
   ```

4. **Run database migrations:**

   ```bash
   npm run db:generate
   npm run db:migrate
   ```

5. **Start the server:**
   ```bash
   npm run dev
   ```

## Testing with HTTPie

### 1. Check if server is running:

```bash
http GET http://localhost:3000/health
```

### 2. Test User Signup:

```bash
http POST http://localhost:3000/api/auth/sign-up \
  name="John Doe" \
  email="john@example.com" \
  password="password123" \
  role="user"
```

**Expected Response (201):**

```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### 3. Test Duplicate Email (should fail):

```bash
http POST http://localhost:3000/api/auth/sign-up \
  name="Jane Doe" \
  email="john@example.com" \
  password="password456" \
  role="user"
```

**Expected Response (409):**

```json
{
  "error": "User with this email already exists"
}
```

### 4. Test Validation Errors:

```bash
http POST http://localhost:3000/api/auth/sign-up \
  name="J" \
  email="invalid-email" \
  password="123"
```

**Expected Response (400):**

```json
{
  "error": "Validation failed",
  "details": "String must contain at least 2 character(s), Invalid email, String must contain at least 6 character(s)"
}
```

## Alternative: Using curl

### Signup:

```bash
curl -X POST http://localhost:3000/api/auth/sign-up \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "user"
  }'
```

### Health Check:

```bash
curl http://localhost:3000/health
```

## Troubleshooting

- **Database connection error**: Make sure your `DATABASE_URL` in `.env` is correct
- **Port already in use**: Change the `PORT` in `.env` or stop the process using port 3000
- **Module not found errors**: Run `npm install` again
