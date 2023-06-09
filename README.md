# Bookify

## Background

Bookify Online Bookstore
Bookify is an online bookstore that offers a vast collection of books across various genres. Whether you're an avid reader, a student, or someone looking for a specific book, Bookify is your one-stop destination.

Browse through our extensive catalog, featuring popular bestsellers, classic literature, non-fiction titles, and much more. With Bookify, you can easily search for books, explore detailed descriptions, and make secure purchases with just a few clicks.

Stay updated with the latest releases, author spotlights, and reading recommendations. Join our community of book lovers, connect with fellow readers, and share your thoughts and reviews on your favorite books.

Bookify strives to provide an immersive and convenient shopping experience, ensuring that you find the perfect books to indulge your passion for reading. Start exploring Bookify today and embark on a literary journey like never before.

## Authentication

- As a user, I can sign in with my email and password.
- As a user, I can register for a new account with email and password.
- As a user, I can stay signed in after refreshing the page.

## User

- As an admin, I can get all users.
- As an admin, I can delete a user.
- As a user , I can see my profile.
- As a user, I can update my profile.

## Book

- As an admin, I can create a new book.
- As an admin, I can update a book.
- As an admin, I can delete a book.
- As a user or admin, I can get all books.
- As a user or admin, I can get a book by its ID.

## Cart

- As a user, I can add books to my cart.
- As a user, I can update books in my cart.

## Order

- As an admin, I can get all of order
- As a user, I can create an order.
- As a user, I can retrieve all of my orders.
- As a user, I can retrieve a specific order.
- As a user, I can cancel an order.

## Review

- As a user, I can leave a comment of a book.
- As a user, I can get all of my comment.
- As a user, I can update my comment.
- As a user, I can delete my comment.

## Categoty

- As a user, I get all category.
- As a user, I get a category and books of that category.
- As an admin, I can create a category.
- As an admin, I can update a category.
- As an admin, I can delete a category.

## BookCategory

- As an admin, I can create a Bookcategories to link a book to categories of them.
- As an admin, I can update a Bookcategories.
- As an admin, I can delete a Bookcategories.

# API endpoints

## Auth api

```js
/**
 * @route POST /auth/login
 * @description Log in with username and password
 * @body {email, passsword}
 * @access Public
 */
```

## User apis

```javaScript
/**
 * @route POST /users
 * @description Register for a new account
 * @body {name, email, passsword}
 * @access Public
 */
```

```javaScript
/**
 * @route GET /users
 * @description get all User
 * @body none
 * @access admin
 */
```

```javaScript
/**
 * @route GET /users/:id
 * @description get a User by id
 * @body none
 * @access Public
 */
```

```javaScript
/**
 * @route PUT /users/:id
 * @description update a user
 * @body none
 * @access User
 */
```

```javaScript
/**
 * @route DELETE /users/:id
 * @description delete a User
 * @body none
 * @access admin
 */
```

## Book apis

```javaScript
/**
 * @route POST /books/
 * @description Create a new book
 * @body { name, author, price, publicationDate }
 * @access admin
 */
```

```javaScript
/**
 * @route GET /books
 * @description Get all books
 * @body none
 * @access Public
 */
```

```javaScript
/**
 * @route GET /books/:id
 * @description Get book by id
 * @body none
 * @access Public
 */
```

```javaScript
/**
 * @route PUT /books/:id
 * @description Update a book
 * @body { name, author, price, publicationDate }
 * @access admin
 */
```

```javaScript
/**
 * @route DELETE /books/:id
 * @description Delete a book
 * @body none
 * @access admin
 */
```

## Category apis

```javaScript
/**
 * @route POST /categories/
 * @description create a new category
 * @body { categoryName, description }
 * @access admin
 */
```

```javaScript
/**
 * @route GET /categories/
 * @description Get all category
 * @body none
 * @access Public
 */
```

```javaScript
/**
 * @route GET /categories/:id
 * @description Get a category by id
 * @body none
 * @access Public
 */
```

```javaScript
/**
 * @route PUT /categories/:id
 * @description Update a category by id
 * @body { categoryName, description }
 * @access Admin
 */
```

```javaScript
/**
 * @route DELETE /categories/:id
 * @description Delete a category by id
 * @body none
 * @access Admin
 */
```

## Book categories apis

```javaScript
/**
 * @route GET /bookCategory/
 * @description Get all bookCategory
 * @body none
 * @access Admin
 */
```

```javaScript
/**
 * @route POST /bookCategory/
 * @description Create a new bookCategory
 * @body { bookId, categoryIds }
 * @access Admin
 */
```

```javaScript
/**
 * @route DELETE /bookCategory/:id
 * @description DELETE a bookCategory
 * @body none
 * @access Admin
 */
```

## Review apis

```javaScript
/**
 * @route GET /reviews/:id
 * @description Get all review of a user
 * @body none
 * @access Public
 */
```

```javaScript
/**
 * @route POST /reviews/:id
 * @description Create a new review
 * @body { bookId, comment }
 * @access User
 */
```

```javaScript
/**
 * @route PUT /reviews/:id
 * @description Update a review
 * @body { reviewId, comment }
 * @access User
 */
```

```javaScript
/**
 * @route DELETE /reviews/:id
 * @description Delete a review
 * @body { reviewId }
 * @access User
 */
```

## Cart api

```javaScript
/**
 * @route PUT /carts/:id
 * @description Update cart
 * @body { bookId, quantity, price }
 * @access User
 */
```

## Order apis

```javaScript
/**
 * @route POST /orders/:id
 * @description Create a order
 * @body { books, shippingAddress }
 * @access User
 */
```

```javaScript
/**
 * @route GET /orders/
 * @description GET all order
 * @body none
 * @access admin
 */
```

```javaScript
/**
 * @route GET /orders/:userid
 * @description GET all order of a user
 * @body none
 * @access User , amdin
 */
```

```javaScript
/**
 * @route PUT /orders/:userid/:orderid
 * @description Update a order
 * @body { status }
 * @access User , amdin
 */
```

## Entity Relationship Diagram

![Image](https://i.imgur.com/SuOUZEF.jpg)
