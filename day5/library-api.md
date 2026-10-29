# Library API Design

RESTful API specification for managing books within a library resource.

## Endpoints

### 1. List All Books

- **Method:** `GET`
- **Path:** `/api/books`
- **Description:** Retrieves a complete list of all books in the library inventory.
- **Success Status Code:** `200 OK`

### 2. List Books by Author (Query Parameter)

- **Method:** `GET`
- **Path:** `/api/books?author=AuthorName`
- **Description:** Retrieves a filtered list of books written by a specific author.
- **Success Status Code:** `200 OK`

### 3. Get One Book

- **Method:** `GET`
- **Path:** `/api/books/{id}`
- **Description:** Retrieves detailed information for a single book specified by its unique ID.
- **Success Status Code:** `200 OK`

### 4. Create a Book

- **Method:** `POST`
- **Path:** `/api/books`
- **Description:** Adds a new book entry to the library collection.
- **Example Request Body:**
  ```json
  {
    "title": "Clean Code",
    "author": "Robert C. Martin",
    "publishedYear": 2008,
    "genre": "Programming"
  }
  ```
