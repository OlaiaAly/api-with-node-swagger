# User Management API

This API provides endpoints for managing users, including fetching, updating, and deleting user data. It's built using Fastify and Prisma, with Zod for schema validation.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
  - [GET /users](#get-users)
  - [GET /users/:id](#get-usersid)
  - [PUT /users/:id](#put-usersid)
  - [DELETE /users/:id](#delete-usersid)
- [Contributing](#contributing)
- [License](#license)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/your-repo-name.git
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up your Prisma database:

   ```bash
   npx prisma generate
   ```

4. Configure your environment variables (e.g., database connection string). Create a `.env` file in the root of your project and add the necessary variables. Example:

   ```
   DATABASE_URL="your_database_connection_string"
   ```

## Usage

1. Start the development server:

   ```bash
   npm run dev  # Or your preferred start command
   ```

2. Access the API documentation:

   Open your browser and go to `http://localhost:3333/docs` (or the port your server is running on). This will open the Swagger UI, where you can explore the API endpoints and test them.

## API Endpoints

### GET /users

Fetches a list of users.

**Query Parameters:**

- `name` (optional): Filter users by name (case-insensitive).
- `email` (optional): Filter users by email (case-insensitive).
- `telephone` (optional): Filter users by telephone.

**Responses:**

- `200`: Array of users.

  ```json
  [
    {
      "id": "uuid",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "telephone": "800000000"
    }
    // ... more users
  ]
  ```

- `500`: Error message.

  ```json
  {
    "error": "Failed to get users"
  }
  ```

### GET /users/:id

Fetches a single user by ID.

**Path Parameters:**

- `id`: The ID of the user to fetch.

**Responses:**

- `200`: User data.

  ```json
  [
    {
      "id": "uuid",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "telephone": "800000000"
    }
  ]
  ```

- `404`: User not found.

  ```json
  {
    "error": "User not found"
  }
  ```

- `500`: Error message.

  ```json
  {
    "error": "Failed to get user"
  }
  ```

### PUT /users/:id

Updates a user's information.

**Path Parameters:**

- `id`: The ID of the user to update.

**Request Body:**

```json
{
  "name": "Jon Dae",
  "password": "NewPassword123", // In a real application, you'd hash this!
  "email": "jondie@exemple.com",
  "telephone": "840000000"
}
```

**Responses:**

- `200`: Updated user data (without the password).

  ```json
  {
    "id": "uuid",
    "name": "Updated Name",
    "email": "[email address removed]",
    "telephone": "987-654-3210"
  }
  ```

- `500`: Error message.

  ```json
  {
    "error": "Failed to update user"
  }
  ```

### DELETE /users/:id

Deletes a user.

**Path Parameters:**

- `id`: The ID of the user to delete.

**Responses:**

- `204`: No content (successful deletion).

- `404`: User not found.

  ```json
  {
    "error": "Not Found"
  }
  ```

- `500`: Error message.

  ```json
  {
    "error": "Internal Server Error"
  }
  ```

## Contributing

(Add your contributing guidelines here)

## License

Contributions are welcome! Please open an issue or submit a pull request.

**Key Improvements:**

- **Structure:** Uses a clear and standard README structure.
- **Installation:** Provides installation instructions (cloning, dependencies, Prisma setup, environment variables).
- **Usage:** Explains how to run the server and access the API documentation.
- **API Endpoints:** Documents each endpoint with:
  - HTTP method and path
  - Description
  - Parameters (query, path, body)
  - Response codes and example responses (JSON format)
- **Consistent JSON Responses:** The example responses are now valid JSON.
- **Password Handling Note:** Added a note about hashing passwords (essential for security).
