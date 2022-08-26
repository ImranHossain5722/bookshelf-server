const express = require("express");
const app = express();
const mongoose = require("mongoose");
const socket = require("socket.io");
const cors = require("cors");
const { json } = require("express");
require("dotenv").config();
const port = process.env.PORT;
const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerJsDocs = YAML.load("./api.yaml");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
// const SSLCommerzPayment = require("sslcommerz-lts");
// const store_id = `${process.env.STORE_ID}`;
// const store_passwd = `${process.env.STORE_PASS}`;
// const is_live = false;
//------ middleware ------------//

app.use(cors());
app.use(json());
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerJsDocs));
//------------------------------//

// ----------- Database ---------//

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.k6cud.mongodb.net/BookShelf?retryWrites=true&w=majority`;
mongoose.connect(uri, () => {
  console.log("DB connected");
});

//----------------mongoose validator ------------//
// //To run it for just one query:
// mongoose.Schema.updateOne({}, {}, { runValidators: true });

// //To run globally:
// mongoose.plugin((schema) => {
//   schema.pre("findOneAndUpdate", setRunValidators);
//   schema.pre("updateMany", setRunValidators);
//   schema.pre("updateOne", setRunValidators);
//   schema.pre("update", setRunValidators);
// });

// function setRunValidators() {
//   this.setOptions({ runValidators: true });
// }

// -------- mongoose schemas ------//
const Book = require("./Book");
const Author = require("./Author");
const Publisher = require("./Publisher");
const UserProfile = require("./UserProfile");
const Category = require("./Category");
const Order = require("./Order");
const Review = require("./Review");
const BookRequest = require("./BookRequest");
const Messages = require("./Messages");
const BookReview = require("./BookReview");
const Post = require("./Post");
const Sells = require("./Sells");

//-------------------------------//

app.get("/", (req, res) => {
  res.send("Welcome to BookShelf");
});

app.post("/add-book", (req, res) => {
  // const {
  //   book_title,
  //   book_description,
  //   book_edition,
  //   book_country,
  //   book_language,
  //   book_author,
  //   book_publisher,
  //   book_pages,
  //   discount,
  //   book_price,
  //   book_qnt,
  //   book_category,
  //   book_cover_photo_url,
  // } = req.body;
  // const bookData = {
  // book_title,
  // book_description,
  // book_edition,
  // book_country,
  // book_language,
  // book_author,
  // book_publisher,
  // book_pages,
  // discount,
  // book_price,
  // book_qnt,
  // book_category,
  // book_cover_photo_url,
  // };
  const run = async () => {
    try {
      const book = await Book.create(req.body);
      await Sells.updateOne(
        {
          user_id: book.seller_id,
        },
        {
          $push: { books_list: book._id },
        }
      );
      res.send(book);
    } catch (e) {
      res.send(e.massage);
    }
  };
  run();
});
app.patch("/update-book", (req, res) => {
  const bookId = req.query.bid;
  const {
    book_title,
    book_description,
    book_edition,
    book_country,
    book_language,
    book_author,
    book_publisher,
    book_pages,
    discount,
    book_price,
    book_qnt,
    book_category,
    book_cover_photo_url,
  } = req.body;

  const run = async () => {
    try {
      const book = await Book.findById(bookId);
      book.book_title = book_title;
      book.book_description = book_description;
      book.book_edition = book_edition;
      book.book_language = book_language;
      book.book_author = book_author;
      book.book_publisher = book_publisher;
      book.book_pages = book_pages;
      book.discount = discount;
      book.book_price = book_price;
      book.book_qnt = book_qnt;
      book.book_category = book_category;
      book.book_cover_photo_url = book_cover_photo_url;

      await book.save();
      res.send(book);
    } catch (e) {
      res.send(e.massage);
    }
  };
  run();
});

app.post("/add-author", (req, res) => {
  const { author_name, author_email, photo_url } = req.body;
  const authorData = {
    author_name,
    author_email,
    photo_url,
  };
  const run = async () => {
    try {
      const author = await Author.create(authorData);
      res.send(author);
    } catch (e) {
      res.send(e.massage);
    }
  };
  run();
});

app.get("/all-authors", (req, res) => {
  const run = async () => {
    try {
      const author = await Author.find();
      res.send(author);
    } catch (e) {
      res.send(e.massage);
    }
  };
  run();
});

app.post("/add-publisher", (req, res) => {
  const { publisher_name, publisher_email, photo_url } = req.body;
  const publisherData = {
    publisher_name,
    publisher_email,
    photo_url,
  };
  const run = async () => {
    try {
      const publisher = await Publisher.create(publisherData);
      res.send(publisher);
    } catch (e) {
      res.send(e.massage);
    }
  };
  run();
});

app.get("/all-publishers", (req, res) => {
  const run = async () => {
    try {
      const publisher = await Publisher.find();
      res.send(publisher);
    } catch (e) {
      res.send(e.massage);
    }
  };
  run();
});

app.post("/add-category", (req, res) => {
  const { category_title, category_icon_url } = req.body;
  const categoryData = {
    category_title,
    category_icon_url,
  };
  const run = async () => {
    try {
      const category = await Category.create(categoryData);
      res.send(category);
    } catch (e) {
      res.send(e.message);
    }
  };
  run();
});

// handle login start
app.post("/login-user", (req, res) => {
  const {
    displayName: user_name,
    uid,
    email: user_email,
    photoURL: user_photo_url,
  } = req.body;
  const user_role = "user";
  const userData = {
    user_name,
    uid,
    user_email,
    user_role,
  };

  const run = async () => {
    try {
      const existUser = await UserProfile.find({ uid });
      if (existUser.length === 0) {
        const userProfile = await UserProfile.create(userData);

        res.send(userProfile);
      } else {
        res.send(existUser[0]);
      }
    } catch (e) {
      res.send(e.message);
    }
  };
  run();
});

app.post("/register-publisher", (req, res) => {
  const { user_name, uid, user_email, user_photo_url } = req.body;
  const user_role = "publisher";
  const userData = {
    user_name,
    uid,
    user_email,
    user_photo_url,
    user_role,
  };
  const run = async () => {
    try {
      const userProfile = await UserProfile.create(userData);
      const {
        _id: owner_id,
        user_name: publisher_name,
        user_email: publisher_email,
        user_photo_url: photo_url,
      } = userProfile;
      const publisherData = {
        owner_id,
        publisher_name,
        publisher_email,
        photo_url,
      };
      await Publisher.create(publisherData);
      await Sells.create({ user_id: userProfile._id });
      res.send(userProfile);
    } catch (e) {
      res.send(e.message);
    }
  };
  run();
});

app.post("/register-author", (req, res) => {
  const { user_name, uid, user_email, user_photo_url, user_phone } = req.body;
  const user_role = "author";
  const userData = {
    user_name,
    uid,
    user_email,
    user_photo_url,
    user_role,
    user_phone,
  };

  const run = async () => {
    try {
      const userProfile = await UserProfile.create(userData);
      const {
        _id: owner_id,
        user_name: author_name,
        user_email: author_email,
        user_photo_url: photo_url,
      } = userProfile;
      const authorData = {
        owner_id,
        author_name,
        author_email,
        photo_url,
      };
      await Author.create(authorData);
      await Sells.create({ user_id: userProfile._id });
      res.send(userProfile);
    } catch (e) {
      res.send(e.message);
    }
  };
  run();
});

// handle login end

app.post("/add-to-cart", (req, res) => {
  const { user_id, cart_data } = req.body;
  console.log(req.body);
  const run = async () => {
    try {
      const userProfile = await UserProfile.where("_id").equals(user_id);

      userProfile[0].user_cart.push(cart_data);
      userProfile[0].save();
      res.send(userProfile);
    } catch (e) {
      res.send(e.message);
    }
  };
  run();
});

app.get("/get-cart-data", (req, res) => {
  const id = req.query.id;
  const run = async () => {
    try {
      const cartData = await UserProfile.findById(id)
        .select("user_cart")
        .populate("user_cart.book");
      res.send(cartData);
    } catch (e) {
      res.send(e.message);
    }
  };
  run();
});

app.patch("/update-cart-quantity", (req, res) => {
  const cid = req.query.cid;
  const qnt = parseInt(req.query.qnt);

  const run = async () => {
    try {
      const cartData = await UserProfile.updateOne(
        { "user_cart._id": cid },
        {
          $set: {
            "user_cart.$.qnt": qnt,
          },
        }
      );

      res.send(cartData);
    } catch (e) {
      res.send(e.message);
    }
  };
  run();
});

app.post("/add-to-wishlist", (req, res) => {
  const { user_id, wishlist_data } = req.body;
  const run = async () => {
    try {
      const userProfile = await UserProfile.findById(user_id);
      userProfile.user_wishlist.push(wishlist_data);
      userProfile.save();
      res.send(userProfile);
    } catch (e) {
      res.send(e.message);
    }
  };
  run();
});

app.get("/get-wishlist-data", (req, res) => {
  const user_id = req.query.id;
  const run = async () => {
    try {
      const wishlistData = await UserProfile.where("_id")
        .equals(user_id)
        .select("user_wishlist")
        .populate("user_wishlist.book")
        .populate({
          path: "user_wishlist.book",
          populate: {
            path: "book_author",
            model: "Author",
            select: "author_name",
          },
        });

      res.send(wishlistData);
    } catch (e) {
      res.send(e.message);
    }
  };
  run();
});

app.get("/all-users", (req, res) => {
  const run = async () => {
    try {
      const allUsers = await UserProfile.find().select([
        "user_name",
        "user_email",
        "user_photo_url",
        "user_role",
      ]);
      res.send(allUsers);
    } catch (e) {
      res.send(e.message);
    }
  };
  run();
});

app.get("/get-user", (req, res) => {
  const uid = req.query.uid;
  const run = async () => {
    try {
      const userData = await UserProfile.where("uid").equals(uid);
      res.send(userData);
    } catch (e) {
      res.send(e.message);
    }
  };
  run();
});

app.get("/get-user-by-email", (req, res) => {
  const email = req.query.email;
  const run = async () => {
    try {
      const userData = await UserProfile.where("user_email").equals(email);
      res.send(userData);
    } catch (e) {
      res.send(e.message);
    }
  };
  run();
});

app.get("/get-all-users-email", (req, res) => {
  const run = async () => {
    try {
      const userData = await UserProfile.find().select("user_email");
      res.send(userData);
    } catch (e) {
      res.send(e.message);
    }
  };
  run();
});

app.put("/update-user", (req, res) => {
  const id = req.query.id;
  const { user_name, user_phone, user_address, user_photo_url, user_birthday } =
    req.body;

  const run = async () => {
    try {
      const userData = await UserProfile.findById(id);
      if (user_name) {
        userData.user_name = user_name;
        await userData.save();
      }
      if (user_phone) {
        userData.user_phone = user_phone;
        await userData.save();
      }
      if (user_address) {
        userData.user_address = user_address;
        await userData.save();
      }
      if (user_photo_url) {
        userData.user_photo_url = user_photo_url;
        await userData.save();
      }
      if (user_birthday) {
        userData.user_birthday = user_birthday;
        await userData.save();
      }

      const updatedUser = await UserProfile.findById(id);
      res.send(updatedUser);
    } catch (e) {
      res.send(e.message);
    }
  };
  run();
});

app.patch("/update-user-role", (req, res) => {
  const id = req.query.id;
  const { user_role } = req.body;

  const run = async () => {
    try {
      const updateUserRole = await UserProfile.findById(id);

      updateUserRole.user_role = user_role;
      await updateUserRole.save();

      const updatedUserRole = await UserProfile.findById(id);
      res.send(updatedUserRole);
    } catch (e) {
      res.send(e.message);
    }
  };
  run();
});

app.get("/all-books", (req, res) => {
  const run = async () => {
    try {
      const books = await Book.find()
        .populate("book_category.category_id")
        .populate("book_author")
        .populate("book_publisher");

      res.send(books);
    } catch (e) {
      res.send(e.massage);
    }
  };
  run();
});

app.get("/books", (req, res) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const run = async () => {
    try {
      const result = {};

      const pageCount = (await Book.find().countDocuments()) / limit;
      result.pages = Math.ceil(pageCount);
      result.books = await Book.find().limit(limit).skip(startIndex).exec();
      // const cn = await Book.find().countDocuments();

      res.send(result);
    } catch (e) {
      res.send(e.massage);
    }
  };
  run();
});

app.get("/get-book", (req, res) => {
  const id = req.query.id;

  const run = async () => {
    try {
      viewCount(id);
      const book = await Book.where("_id")
        .equals(id)
        .populate("book_category.category_id")
        .populate("book_author")
        .populate("book_publisher");

      res.send(book);
    } catch (e) {
      res.send(e.massage);
    }
  };
  run();
});

app.get("/get-book-by-category", (req, res) => {
  const ct = req.query.ct;
  const run = async () => {
    try {
      const book = await Book.where("book_category.category_id")
        .equals(ct)
        .populate("book_category.category_id")
        .populate("book_author")
        .populate("book_publisher");
      res.send(book);
    } catch (e) {
      res.send(e.massage);
    }
  };
  run();
});

app.get("/get-book-by-author", (req, res) => {
  const aut = req.query.aut;
  const run = async () => {
    try {
      const book = await Book.where("book_author")
        .equals(aut)
        .populate("book_category.category_id")
        .populate("book_author")
        .populate("book_publisher");
      res.send(book);
    } catch (e) {
      res.send(e.massage);
    }
  };
  run();
});

app.get("/get-book-by-publisher", (req, res) => {
  const pub = req.query.pub;
  const run = async () => {
    try {
      const book = await Book.where("book_publisher")
        .equals(pub)
        .populate("book_category.category_id")
        .populate("book_author")
        .populate("book_publisher");
      res.send(book);
    } catch (e) {
      res.send(e.massage);
    }
  };
  run();
});

app.get("/all-categories", (req, res) => {
  const run = async () => {
    try {
      const allCategories = await Category.find();
      res.send(allCategories);
    } catch (e) {
      res.send(e.massage);
    }
  };
  run();
});

app.get("/all-publishers", (req, res) => {
  const run = async () => {
    try {
      const allPublishers = await Publisher.find();
      res.send(allPublishers);
    } catch (e) {
      res.send(e.massage);
    }
  };
  run();
});

app.get("/all-authors", (req, res) => {
  const run = async () => {
    try {
      const allAuthors = await Author.find();
      res.send(allAuthors);
    } catch (e) {
      res.send(e.massage);
    }
  };
  run();
});

app.get("/search", (req, res) => {
  const sq = req.query.sq;
  const run = async () => {
    try {
      const searchResult = await Book.find({
        $or: [{ book_title: { $regex: sq, $options: "i" } }],
      });
      res.send(searchResult);
    } catch (e) {
      res.send(e.massage);
    }
  };
  run();
});

// handle order

app.post("/place-order", (req, res) => {
  const run = async () => {
    try {
      const placedOrder = await Order.create(req.body);
      res.send(placedOrder);
    } catch (e) {
      res.send(e.massage);
    }
  };
  run();
});

app.get("/get-order-data", (req, res) => {
  const user_id = req.query.id;
  const run = async () => {
    try {
      const placedOrderData = await Order.where("user_id")
        .equals(user_id)
        .populate("user_id")
        .populate("ordered_items.book_id")
        .populate({
          path: "ordered_items.book_id",
          populate: {
            path: "book_author",
            model: "Author",
            select: "author_name",
          },
          populate: {
            path: "book_publisher",
            model: "Publisher",
            select: "publisher_name",
          },
        });
      res.send(placedOrderData);
    } catch (e) {
      res.send(e.massage);
    }
  };
  run();
});

app.get("/get-order-details", (req, res) => {
  const order_id = req.query.oid;
  const run = async () => {
    try {
      const placedOrderData = await Order.where("_id")
        .equals(order_id)
        .populate("user_id")
        .populate("ordered_items.book_id");
      res.send(placedOrderData);
    } catch (e) {
      res.send(e.massage);
    }
  };
  run();
});

app.get("/all-orders", (req, res) => {
  const run = async () => {
    try {
      const allOrders = await Order.find()
        .populate("user_id")
        .populate("ordered_items.book_id");
      res.send(allOrders);
    } catch (e) {
      res.send(e.massage);
    }
  };
  run();
});

app.patch("/update-price", (req, res) => {
  const { order_id, order_price } = req.body;
  const run = async () => {
    try {
      const selectedOrder = await Order.findById(order_id);
      selectedOrder.ordered_price_amount = order_price;
      await selectedOrder.save();
      res.send(selectedOrder);
    } catch (e) {
      res.send(e.massage);
    }
  };
  run();
});

app.delete("/remove-from-order", (req, res) => {
  const orderId = req.query.oid;
  const itemId = req.query.itemId;
  const run = async () => {
    try {
      const deleteItem = await Order.updateOne(
        {
          _id: orderId,
        },
        {
          $pull: { ordered_items: { _id: itemId } },
        }
      );
      res.send(deleteItem);
    } catch (e) {
      res.send(e.massage);
    }
  };
  run();
});

// review
app.post("/add-review", (req, res) => {
  const { user_id, review } = req.body;
  const reviewData = {
    user_id,
    review,
  };
  const run = async () => {
    try {
      const addedReview = await Review.create(reviewData);
      res.send(addedReview);
    } catch (e) {
      res.send(e.massage);
    }
  };
  run();
});

app.get("/all-reviews", (req, res) => {
  const run = async () => {
    try {
      const allReviews = await Review.find().populate({
        path: "user_id",
        select: ["user_name", "user_photo_url"],
      });
      res.send(allReviews);
    } catch (e) {
      res.send(e.massage);
    }
  };
  run();
});

// delete cart
app.delete("/remove-from-cart", (req, res) => {
  const cartId = req.query.cid;
  const userId = req.query.id;
  const run = async () => {
    try {
      const deleteItem = await UserProfile.updateOne(
        { _id: userId },
        {
          $pull: { user_cart: { _id: cartId } },
        }
      );
      res.send(deleteItem);
    } catch (e) {
      res.send(e.massage);
    }
  };
  run();
});

app.delete("/delete-cart", (req, res) => {
  const userId = req.query.id;
  const run = async () => {
    try {
      const deleteItem = await UserProfile.updateOne(
        { _id: userId },
        {
          $unset: { user_cart: 1 },
        }
      );
      res.send(deleteItem);
    } catch (e) {
      res.send(e.massage);
    }
  };
  run();
});
// remove form wishlist
app.delete("/remove-from-wishlist", (req, res) => {
  const wishlistId = req.query.wid;
  const userId = req.query.id;
  const run = async () => {
    try {
      const deleteItem = await UserProfile.updateOne(
        { _id: userId },
        {
          $pull: { user_wishlist: { _id: wishlistId } },
        }
      );
      res.send(deleteItem);
    } catch (e) {
      res.send(e.massage);
    }
  };
  run();
});

// BookRequest

app.post("/request-book", (req, res) => {
  const run = async () => {
    const bookData = req.body;
    try {
      const book = await BookRequest.create(bookData);
      res.send(book);
    } catch (e) {
      res.send(e.massage);
    }
  };
  run();
});

//=========================================//
// stripe payment

// app.post("/create-payment-intent", async (req, res) => {
//   // const decodedUid = req.decoded.uid;
//   // const userId = req.body.uid;
//   const orderId = req.query.oid;
//   const paymentInfo = req.body.bill;

//   const run = async () => {
//     try {
//       const orderData = await Order.findById(orderId);
//       const billAmount = orderData.ordered_price_amount * 100;
//       // Create a PaymentIntent with the order amount and currency
//       try {
//         const paymentIntent = await stripe.paymentIntents.create({
//           amount: billAmount,
//           currency: "usd",
//           payment_method_types: ["card"],
//         });

//         orderData.order_status = "paid";
//         await orderData.save();

//         res.send({
//           clientSecret: paymentIntent.client_secret,
//         });
//       } catch (e) {
//         return res.send({ message: e.massage });
//       }
//     } catch (e) {
//       return res.send({ message: e.massage });
//     }
//   };
//   run();
// });

// // app.patch("/payment", async (req, res) => {
// //   // const decodedUid = req.decoded.uid;
// //   // const userId = req.body.uid;
// //   const orderId = req.body.orderId;
// //   const tnxId = req.body.tnxId;

// //   if (decodedUid === userId) {
// //     const run = async () => {
// //       try {
// //         const orderData = await Order.findById(orderId);

// //         orderData.tnx_id = tnxId;
// //         await orderData.save();
// //         orderData.order_status = "paid";
// //         await orderData.save();
// //         // orderData.tnx_id
// //         res.status(200).send(orderData);
// //       } catch (e) {
// //         e;
// //       }
// //     };
// //     run();
// //   } else {
// //     return res.status(403).send({ message: "Forbidden access" });
// //   }
// // });

//=======================================//

//======================================//
// New Api //
//======================================//

app.patch("/update-order-tracking", (req, res) => {
  const order_id = req.query.oid;
  const {
    placed_status,
    placed_date,
    picked_status,
    picked_date,
    picked_by,
    delivered_status,
    delivered_date,
    delivered_by,
  } = req.body;
  const run = async () => {
    try {
      const selectedOrder = await Order.findById(order_id);
      if (placed_status && placed_date) {
        selectedOrder.placed_status = placed_status;
        selectedOrder.placed_date = placed_date;
        await selectedOrder.save();
      }
      if (picked_status && picked_date && picked_by) {
        selectedOrder.picked_status = picked_status;
        selectedOrder.picked_date = picked_date;
        selectedOrder.picked_by = picked_by;
        await selectedOrder.save();
      }
      if (delivered_status && delivered_date && delivered_by) {
        selectedOrder.delivered_status = delivered_status;
        selectedOrder.delivered_date = delivered_date;
        selectedOrder.delivered_by = delivered_by;
        await selectedOrder.save();
      }

      res.send(selectedOrder);
    } catch (e) {
      res.send(e.massage);
    }
  };
  run();
});

app.get("/picked-orders", (req, res) => {
  const delivery_man_id = req.query.uid;

  const run = async () => {
    try {
      const orderPickedBy = await Order.where("picked_by").equals(
        delivery_man_id
      );

      res.send(orderPickedBy);
    } catch (e) {
      res.send(e.massage);
    }
  };
  run();
});

app.get("/delivered-orders", (req, res) => {
  const delivery_man_id = req.query.uid;

  const run = async () => {
    try {
      const orderPickedBy = await Order.where("delivered_by").equals(
        delivery_man_id
      );

      res.send(orderPickedBy);
    } catch (e) {
      res.send(e.massage);
    }
  };
  run();
});

app.post("/add-book-review", (req, res) => {
  const { user_id, book_id, ratings, review } = req.body;
  const reviewData = {
    user_id,
    book_id,
    review,
    ratings,
  };
  const run = async () => {
    try {
      const addedBookReview = await BookReview.create(reviewData);
      const reviewedBook = await Book.updateOne(
        {
          _id: addedBookReview.book_id,
        },
        {
          $push: { book_reviews: { review_id: addedBookReview._id } },
        }
      );
      res.send(addedBookReview);
    } catch (e) {
      res.send(e.massage);
    }
  };
  run();
});

app.delete("/delete-book", (req, res) => {
  const bookId = req.query.id;
  const run = async () => {
    try {
      const book = await Book.find({ _id: bookId }).remove().exec();
      res.send(book);
    } catch (e) {
      res.send(e.massage);
    }
  };
  run();
});

app.post("/add-post", (req, res) => {
  const { user_id, post_content, post_image } = req.body;
  const postData = {
    user_id,
    post_content,
    post_image,
  };
  // console.log(postData);
  const run = async () => {
    try {
      const addedPost = await Post.create(postData);
      res.send(addedPost);
    } catch (e) {
      res.send(e.massage);
    }
  };
  run();
});

app.get("/get-posts", (req, res) => {
  const run = async () => {
    try {
      const posts = await Post.find()
        .select({
          createdAt: 1,
          post_content: 1,
          post_image: 1,
          post_comments: 1,
        })
        .sort({ createdAt: -1 })
        .populate("user_id")
        .populate("post_comments.user_id")
        .populate("up_votes")
        .populate("down_votes");
      res.send(posts);
    } catch (e) {
      res.send(e.massage);
    }
  };
  run();
});

app.patch("/add-comment", (req, res) => {
  const { user_id, post_id, comment } = req.body;
  const commentData = {
    post_id,
    user_id,
    comment,
  };
  const run = async () => {
    try {
      const addedComment = await Post.updateOne(
        {
          _id: post_id,
        },
        {
          $push: { post_comments: { user_id: user_id, comment: comment } },
        }
      );
      res.send(addedComment);
    } catch (e) {
      res.send(e.massage);
    }
  };
  run();
});

app.patch("/upvote-post", (req, res) => {
  const { user_id, post_id } = req.body;
  const commentData = {
    post_id,
    user_id,
  };
  const run = async () => {
    try {
      const upvotePost = await Post.updateOne(
        { _id: post_id },
        {
          $addToSet: {
            up_votes: user_id,
          },
        }
      );
      res.send(upvotePost);
    } catch (e) {
      res.send(e.massage);
    }
  };
  run();
});

app.patch("/downvote-post", (req, res) => {
  const { user_id, post_id } = req.body;

  const run = async () => {
    try {
      const downvotePost = await Post.updateOne(
        { _id: post_id },
        {
          $pull: {
            up_votes: user_id,
          },
        }
      );
      res.send(downvotePost);
    } catch (e) {
      res.send(e.massage);
    }
  };
  run();
});

app.get("/get-popular-books", (req, res) => {
  const id = req.query.id;

  const run = async () => {
    try {
      viewCount(id);
      const book = await Book.find({})
        .select({ book_title: 1, view_count: 1 })
        .sort({ view_count: -1 })
        .limit(8)
        .populate("book_category.category_id")
        .populate("book_author")
        .populate("book_publisher");

      res.send(book);
    } catch (e) {
      res.send(e.massage);
    }
  };
  run();
});

app.get("/get-best-discount-books", (req, res) => {
  const id = req.query.id;

  const run = async () => {
    try {
      viewCount(id);
      const book = await Book.find({})
        .select({ discount: 1, book_title: 1 })
        .sort({ discount: -1 })
        .limit(8)
        .populate("book_category.category_id")
        .populate("book_author")
        .populate("book_publisher");

      res.send(book);
    } catch (e) {
      res.send(e.massage);
    }
  };
  run();
});

//======================================//
// payment Api //
//======================================//

app.get("/make-payment", (req, res) => {
  const orderId = req.query.oid;
  const run = async () => {
    try {
      const placedOrderData = await Order.findById(orderId)
        .select({})
        .populate("user_id")
        .populate("ordered_items.book_id");
      try {
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          mode: "payment",
          line_items: placedOrderData.ordered_items.map((item) => {
            return {
              price_data: {
                currency: "usd",
                product_data: {
                  name: item.book_id.book_title,
                },
                unit_amount: item.book_id.book_price * 100,
              },
              quantity: item.qnt,
            };
          }),
          success_url: `${process.env.CLIENT_URL}dashboard`,
          cancel_url: `${process.env.CLIENT_URL}dashboard`,
        });
        // const sessionInfo = await stripe.checkout.sessions.retrieve(
        //   session.id,
        //   {
        //     expand: ["line_items"],
        //   }
        // );
        res.json({ url: session.url });
      } catch (e) {
        res.status(500).json({ error: e.message });
      }
      // res.send(placedOrderData);
    } catch (e) {
      res.send(e.massage);
    }
  };
  run();
});

// app.get("/make-payment", (req, res) => {
//   const orderId = req.query.oid;
//   const orderAmount = req.query.price;

//   const data = {
//     total_amount: orderAmount,
//     currency: "BDT",
//     tran_id: `tnx_${orderId}`, // use unique tran_id for each api call
//     success_url: `${process.env.CLIENT_URL}/dashboard`,
//     fail_url: "http://localhost:3030/fail",
//     cancel_url: "http://localhost:3030/cancel",
//     ipn_url: "http://localhost:3030/ipn",
//     shipping_method: "Courier",
//     product_name: "Computer.",
//     product_category: "Electronic",
//     product_profile: "general",
//     cus_name: "Customer Name",
//     cus_email: "customer@example.com",
//     cus_add1: "Dhaka",
//     cus_add2: "Dhaka",
//     cus_city: "Dhaka",
//     cus_state: "Dhaka",
//     cus_postcode: "1000",
//     cus_country: "Bangladesh",
//     cus_phone: "01711111111",
//     cus_fax: "01711111111",
//     ship_name: "Customer Name",
//     ship_add1: "Dhaka",
//     ship_add2: "Dhaka",
//     ship_city: "Dhaka",
//     ship_state: "Dhaka",
//     ship_postcode: 1000,
//     ship_country: "Bangladesh",
//   };
//   const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
//   sslcz.init(data).then((apiResponse) => {
//     // Redirect the user to payment gateway
//     let GatewayPageURL = apiResponse.GatewayPageURL;
//     res.redirect(GatewayPageURL);
//     // console.log("Redirecting to: ", GatewayPageURL);
//   });
// });

// app.get("/transaction-query-by-transaction-id", (req, res) => {
//   const data = {
//     tran_id: `${req.query.tnx}`,
//   };
//   const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
//   sslcz.transactionQueryByTransactionId(data).then((data) => {
//     //process the response that got from sslcommerz
//     //https://developer.sslcommerz.com/doc/v4/#by-session-id
//     console.log(data);
//   });
// });

app.get("/change-order-status", (req, res) => {
  const run = async () => {
    try {
      const placedOrder = await Order.findById(req.query.oid);
      placedOrder.order_status = req.query.status;
      placedOrder.save();
      res.send(placedOrder);
    } catch (e) {
      res.send(e.massage);
    }
  };
  run();
});

//======================================//
// sells Api //
//======================================//

app.get("/get-sells-data", (req, res) => {
  const user_id = req.query.id;

  const run = async () => {
    try {
      const sellsData = await Sells.find({ user_id: user_id }).populate(
        "books_list"
      );
      res.send(sellsData);
    } catch (e) {
      res.send(e.massage);
    }
  };
  run();
});

// app.post("/add-sells-data", (req, res) => {
//   // const {
//   //   user_id,
//   //   total_sells_amount,
//   //   total_sells_qnt,
//   //   total_withdrawal_amount,
//   //   balance_amount,
//   //   books_list,
//   // } = req.body;

//   const run = async () => {
//     try {
//       const sellsData = await Sells.create(req.body);
//       res.send(sellsData);
//     } catch (e) {
//       res.send(e.massage);
//     }
//   };
//   run();
// });
//======================//
const viewCount = (id) => {
  const run = async () => {
    try {
      const book = await Book.updateOne(
        { _id: id },
        {
          $inc: {
            view_count: 1,
          },
        }
      );
    } catch (e) {
      console.log(e.massage);
    }
  };
  run();
};

// const updateSells = (id) => {
//   const run = async () => {
//     try {
//       const book = await Book.updateOne(
//         { _id: id },
//         {
//           $inc: {
//             view_count: 1,
//           },
//         }
//       );
//     } catch (e) {
//       console.log(e.massage);
//     }
//   };
//   run();
// };

//======================================//
// Socket io //
//======================================//

app.post("/addmsg", async (req, res, next) => {
  try {
    const { from, to, message } = req.body;
    const data = await Messages.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });

    if (data) return res.json({ msg: "Message added successfully." });
    else return res.json({ msg: "Failed to add message to the database" });
  } catch (ex) {
    next(ex);
  }
});

app.post("/getmsg", async (req, res, next) => {
  try {
    const { from, to } = req.body;

    const messages = await Messages.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });

    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
      };
    });
    res.json(projectedMessages);
  } catch (ex) {
    next(ex);
  }
});

const server = app.listen(port, () => {
  console.log(`BookShelf listening on port ${port}`);
});

const io = socket(server, {
  cors: {
    origin: ["http://localhost:3000", "https://bookshelf-9bb86.web.app"],
    // credentials: true,
  },
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
  });
});
