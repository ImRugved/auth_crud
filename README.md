# Node.js Authentication API Documentation

## Base URL

```
http://localhost:3000/api/auth
```

## Authentication

For protected routes, include the JWT token in the request header:

```
Authorization: Bearer <your_jwt_token>
```

---

## API Endpoints

### 1. User Signup

**Endpoint:** `POST /signup`

**Request Body:**

```json
{
  "first_name": "John",
  "last_name": "Doe",
  "mobile_no": "1234567890",
  "email": "john@example.com",
  "state": "Maharashtra",
  "city": "Pune",
  "address": "123 Main Street",
  "password": "your_password"
}
```

**Success Response (201 Created):**

```json
{
  "message": "User created successfully"
}
```

**Error Response (400):**

```json
{
  "message": "User already exists"
}
```

### 2. User Login

**Endpoint:** `POST /login`

**Request Body:**

```json
{
  "mobile_no": "1234567890",
  "password": "your_password"
}
```

**Success Response (200 OK):**

```json
{
  "user_id": 1,
  "token": "jwt_token_here",
  "message": "Login successful"
}
```

**Error Response (400):**

```json
{
  "message": "Invalid credentials"
}
```

### 3. Forgot Password

**Endpoint:** `POST /forgot-password`

**Request Body:**

```json
{
  "mobile_no": "1234567890"
}
```

**Success Response (200 OK):**

```json
{
  "message": "OTP generated successfully",
  "otp": "123456"
}
```

**Error Response (400):**

```json
{
  "message": "User not found"
}
```

### 4. Reset Password

**Endpoint:** `POST /reset-password`

**Request Body:**

```json
{
  "mobile_no": "1234567890",
  "otp": "123456",
  "new_password": "new_password_here"
}
```

**Success Response (200 OK):**

```json
{
  "message": "Password reset successfully"
}
```

**Error Response (400):**

```json
{
  "message": "Invalid OTP"
}
```

### 5. Change Password (Protected Route)

**Endpoint:** `POST /change-password`

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Request Body:**

```json
{
  "current_password": "current_password_here",
  "new_password": "new_password_here"
}
```

**Success Response (200 OK):**

```json
{
  "message": "Password changed successfully"
}
```

**Error Response (400):**

```json
{
  "message": "Current password is incorrect"
}
```

**Error Response (401):**

```json
{
  "message": "Access denied. No token provided."
}
```

**Error Response (401):**

```json
{
  "message": "Invalid token"
}
```

### 6. User Logout (Protected Route)

Endpoint: POST /logout

Headers:

```
Authorization: Bearer <jwt_token>
```

Success Response (200 OK):

```
{
  "message": "Logout successful"
}
```

Error Response (401):

```
{
  "message": "Access denied. No 
token provided."
}
```

Error Response (401):

```
{
  "message": "Invalid token"
}
```

## Common Error Responses

All endpoints may return these common error responses:

**Server Error (500):**

```json
{
  "message": "Internal server error"
}
```

## Database Schema

### Users Table

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  mobile_no VARCHAR(15) UNIQUE NOT NULL,
  email VARCHAR(100) NOT NULL,
  state VARCHAR(50) NOT NULL,
  city VARCHAR(50) NOT NULL,
  address TEXT NOT NULL,
  password VARCHAR(255) NOT NULL,
  otp VARCHAR(6),
  token TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Environment Setup

Create a `.env` file in the root directory with the following content:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=Rugved@1234
DB_NAME=auth_crud
JWT_SECRET=rugved_auth_secret_key_2025_secure_token
```

## Setup Instructions

1. Install dependencies:

```bash
npm install
```

2. Start the server:

```bash
npm start
```

## Testing

You can test these APIs using Postman or any other API testing tool. Make sure to:

1. Include the required headers for protected routes
2. Send the correct request body format
3. Handle the response accordingly based on success/error status

4. **For protected routes**, obtain a token by logging in first

---

## API Flow Example

### Complete Authentication Flow:

1. **Sign up a new user** using `POST /signup`
2. **Login with credentials** using `POST /login` to get JWT token
3. **Use the token** for protected routes like `POST /change-password`
4. **If password forgotten**, use `POST /forgot-password` to get OTP
5. **Reset password** using `POST /reset-password` with OTP

### Sample cURL Commands:

**Signup:**

```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "mobileNumber": "1234567890",
    "email": "john@example.com",
    "state": "Maharashtra",
    "city": "Pune",
    "address": "123 Main Street",
    "password": "your_password"
  }'
```

**Login:**

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "mobileNumber": "1234567890",
    "password": "your_password"
  }'
```

**Change Password (Protected):**

```bash
curl -X POST http://localhost:3000/api/auth/change-password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_jwt_token>" \
  -d '{
    "currentPassword": "your_password",
    "newPassword": "new_password"
  }'
```
