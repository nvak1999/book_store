const { sendResponse, catchAsync, AppError } = require("../helpers/utils");
const Order = require("../models/Order");
const Book = require("../models/Book");
const User = require("../models/User");
const Cart = require("../models/Cart");
const orderController = {};

orderController.createOrder = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const { books, shippingAddress } = req.body;

  const user = await User.findById(userId);

  if (!user) {
    throw new AppError(404, "User not found", "Create Order Error");
  }

  const orderedBooks = [];

  for (const { bookId, quantity } of books) {
    const book = await Book.findById(bookId);

    if (!book) {
      throw new AppError(
        404,
        `Book not found: ${bookId}`,
        "Create Order Error"
      );
    }

    const name = book.name;
    const price = book.price;
    const total = quantity * price;

    orderedBooks.push({ bookId, name, quantity, price, total });
  }

  const totalAmount = orderedBooks.reduce(
    (total, { total: bookTotal }) => total + bookTotal,
    0
  );

  const order = await Order.create({
    userId,
    books: orderedBooks,
    status: "Processing",
    totalAmount,
    shippingAddress,
  });

  const bookIds = orderedBooks.map(({ bookId }) => bookId);
  await Cart.updateOne(
    { userId },
    { $pull: { books: { bookId: { $in: bookIds } } } }
  );

  sendResponse(res, 201, true, order, null, "Order created successfully");
});

orderController.getOrder = catchAsync(async (req, res, next) => {
  const orders = await Order.find({});
  return sendResponse(res, 200, true, orders, "Orders retrieved successfully");
});

orderController.getAllOrder = catchAsync(async (req, res, next) => {
  const userId = req.params.userId;

  const orders = await Order.find({ userId, isDeleted: false });

  for (const order of orders) {
    for (const book of order.books) {
      const foundBook = await Book.findById(book.bookId);
      book.name = foundBook.name;
    }
  }

  sendResponse(res, 200, true, orders, null, "Orders retrieved successfully");
});

orderController.getOrderById = catchAsync(async (req, res, next) => {
  const { userId, orderId } = req.params;

  const order = await Order.findOne({ userId, _id: orderId, isDeleted: false });

  if (!order) {
    throw new AppError(404, "Order not found", "Get Order Error");
  }

  sendResponse(res, 200, true, order, null, "Order retrieved successfully");
});

orderController.updateOrder = catchAsync(async (req, res, next) => {
  const { userId, orderId } = req.params;
  const { status } = req.body;

  const order = await Order.findOne({ userId, _id: orderId, isDeleted: false });

  if (!order) {
    throw new AppError(404, "Order not found", "Order Error");
  }

  if (order.status === "Cancelled") {
    sendResponse(res, 200, true, null, null, "Order is already cancelled");
    return;
  }

  order.status = status;
  await order.save();

  sendResponse(res, 200, true, order, null, `Order ${status} successfully`);
});

orderController.deleteOrder = catchAsync(async (req, res, next) => {
  const { userId, orderId } = req.params;

  const order = await Order.findOne({ userId, _id: orderId, isDeleted: false });

  if (!order) {
    throw new AppError(404, "Order not found", "Order Error");
  }

  order.isDeleted = true;

  await order.save();

  sendResponse(res, 200, true, null, null, "Order deleted successfully");
});

module.exports = orderController;
