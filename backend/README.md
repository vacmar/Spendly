# Spendly Backend API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Auth Endpoints

### Register User
- **POST** `/auth/register`
- **Body**: 
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```

### Login User
- **POST** `/auth/login`
- **Body**: 
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```

### Get Current User
- **GET** `/auth/me` (Protected)

### Update Profile
- **PUT** `/auth/profile` (Protected)
- **Body**: 
  ```json
  {
    "name": "Updated Name",
    "preferences": {
      "currency": "EUR",
      "theme": "purple"
    }
  }
  ```

## Expense Endpoints

### Get All Expenses
- **GET** `/expenses` (Protected)
- **Query Parameters**: 
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10)
  - `category`: Filter by category
  - `startDate`: Filter by start date (YYYY-MM-DD)
  - `endDate`: Filter by end date (YYYY-MM-DD)
  - `search`: Search in title/description
  - `sortBy`: Sort field (default: date)
  - `order`: Sort order (asc/desc, default: desc)

### Create Expense
- **POST** `/expenses` (Protected)
- **Body**: 
  ```json
  {
    "title": "Lunch",
    "amount": 15.50,
    "category": "Food & Dining",
    "description": "Optional description",
    "date": "2025-09-16"
  }
  ```

### Get Single Expense
- **GET** `/expenses/:id` (Protected)

### Update Expense
- **PUT** `/expenses/:id` (Protected)

### Delete Expense
- **DELETE** `/expenses/:id` (Protected)

### Get Expense Statistics
- **GET** `/expenses/stats` (Protected)
- **Query Parameters**: 
  - `startDate`: Start date for stats
  - `endDate`: End date for stats

## Budget Endpoints

### Get All Budgets
- **GET** `/budgets` (Protected)

### Set Budget
- **POST** `/budgets` (Protected)
- **Body**: 
  ```json
  {
    "category": "Food & Dining",
    "amount": 500,
    "period": "monthly",
    "alerts": {
      "enabled": true,
      "threshold": 80
    }
  }
  ```

### Get Single Budget
- **GET** `/budgets/:category` (Protected)

### Delete Budget
- **DELETE** `/budgets/:category` (Protected)

### Get Budget Comparison
- **GET** `/budgets/comparison` (Protected)
- **Query Parameters**: 
  - `period`: Period type (monthly/weekly/yearly)

## Categories
Available expense categories:
- Food & Dining
- Transportation
- Shopping
- Entertainment
- Bills & Utilities
- Healthcare
- Education
- Travel
- Personal Care
- Other

## Error Responses
All errors follow this format:
```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed error messages"] // Optional
}
```

## Success Responses
All successful responses follow this format:
```json
{
  "success": true,
  "message": "Success message", // Optional
  "data": {}, // Response data
  "pagination": {} // For paginated responses
}
```
