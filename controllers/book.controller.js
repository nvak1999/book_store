const Book = require("../models/Book.js");
const Review = require("../models/Review.js");
const { sendResponse, catchAsync, AppError } = require("../helpers/utils");
const { default: mongoose } = require("mongoose");
const bookController = {};

// Create a new book
bookController.createBook = catchAsync(async (req, res, next) => {
  const { name, author, price, publicationDate, img, description } = req.body;

  const book = await Book.create({
    name,
    author,
    price,
    publicationDate,
    img,
    description,
  });

  sendResponse(res, 201, true, book, null, "Book created successfully");
});

bookController.getAllBooks = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 10, search, minPrice, maxPrice } = req.query;

  const pageNumber = parseInt(page);
  const limitNumber = parseInt(limit);

  const skip = (pageNumber - 1) * limitNumber;

  const searchQuery = {
    isDeleted: false,
  };

  if (search) {
    const yearPattern = /\b\d{4}\b/;
    const yearMatch = search.match(yearPattern);

    if (yearMatch) {
      searchQuery.publicationDate = {
        $regex: new RegExp(`\\b${yearMatch[0]}\\b`),
      };
    } else {
      searchQuery.$or = [
        { name: { $regex: new RegExp(search, "i") } },
        { categories: { $regex: new RegExp(search, "i") } },
        { author: { $regex: new RegExp(search, "i") } },
        { publicationDate: { $regex: new RegExp(search, "i") } },
      ];
    }
  }

  if (minPrice && maxPrice) {
    const minPriceValue = parseFloat(minPrice);
    const maxPriceValue = parseFloat(maxPrice);
    searchQuery.price = { $gte: minPriceValue, $lte: maxPriceValue };
  }

  const result = await Book.aggregate([
    {
      $match: searchQuery,
    },
    {
      $lookup: {
        from: "bookcategories",
        let: { bookId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$$bookId", "$bookId"] },
            },
          },
          {
            $lookup: {
              from: "categories",
              localField: "categoryId",
              foreignField: "_id",
              as: "category",
            },
          },
          {
            $unwind: "$category",
          },
          {
            $project: {
              _id: 0,
              categoryName: "$category.categoryName",
            },
          },
        ],
        as: "categories",
      },
    },
    {
      $project: {
        name: 1,
        author: 1,
        price: 1,
        publicationDate: 1,
        img: 1,
        description: 1,
        categories: "$categories.categoryName",
      },
    },
    {
      $facet: {
        paginatedBooks: [{ $skip: skip }, { $limit: limitNumber }],
        totalCount: [{ $count: "total" }],
      },
    },
  ]);

  const { paginatedBooks, totalCount } = result[0];

  const totalPages =
    paginatedBooks.length > 0
      ? Math.ceil(totalCount[0].total / limitNumber)
      : 0;

  const response = {
    books: paginatedBooks,
    totalPages,
  };

  sendResponse(res, 200, true, response, null, "Books retrieved successfully");
});

bookController.getBookById = catchAsync(async (req, res, next) => {
  const bookId = req.params.id;

  const [book] = await Book.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(bookId), isDeleted: false },
    },
    {
      $lookup: {
        from: "bookcategories",
        let: { bookId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$$bookId", "$bookId"] },
              isDelete: false,
            },
          },
          {
            $lookup: {
              from: "categories",
              localField: "categoryId",
              foreignField: "_id",
              as: "category",
            },
          },
          {
            $unwind: "$category",
          },
          {
            $project: {
              _id: 0,
              categoryName: "$category.categoryName",
            },
          },
        ],
        as: "categories",
      },
    },
    {
      $project: {
        name: 1,
        author: 1,
        price: 1,
        publicationDate: 1,
        description: 1,
        img: 1,
        categories: "$categories.categoryName",
      },
    },
  ]);

  if (!book) {
    throw new AppError(404, "Book not found", "Get Book Error");
  }

  const reviews = await Review.find({ bookId: book._id, isDeleted: false });

  book.reviews = reviews;

  sendResponse(res, 200, true, book, null, "Book retrieved successfully");
});

bookController.updateBook = catchAsync(async (req, res, next) => {
  const bookId = req.params.id;
  const updateData = req.body;

  const book = await Book.findByIdAndUpdate(
    bookId,
    { $set: { isDeleted: false, ...updateData } },
    { new: true }
  );
  if (!book) {
    throw new AppError(404, "Book not found", "Update Book Error");
  }
  sendResponse(res, 200, true, book, null, "Book updated successfully");
});

bookController.deleteBook = catchAsync(async (req, res, next) => {
  const bookId = req.params.id;

  const book = await Book.findOne({ _id: bookId, isDeleted: false });

  if (!book) {
    throw new AppError(404, "Book not found", "Delete Book Error");
  }

  book.isDeleted = true;
  await book.save();

  sendResponse(res, 200, true, null, null, "Book deleted successfully");
});

module.exports = bookController;
