const express = require("express");
const app = express();
const mongoose = require("mongoose");
var cors = require("cors");
const { json } = require("express");
require("dotenv").config();
const port = process.env.PORT;

//------ middleware ------------//
app.use(cors());
app.use(json());

//------------------------------//

// ----------- Database ---------//

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.k6cud.mongodb.net/BookShelf?retryWrites=true&w=majority`;
mongoose.connect(uri, () => {
  console.log("DB connected");
});

// -------- mongoose schemas ------//
const Book = require("./Book");
const Author = require("./Author");
const Publisher = require("./Publisher");
const UserProfile = require("./UserProfile");
const Category = require("./Category");
const Order = require("./Order");
const Review = require("./Review");

//-------------------------------//

app.get("/", (req, res) => {
  res.send("Welcome to BookShelf");
});

app.post("/add-book", (req, res) => {
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
  const bookData = {
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
  };
  const run = async () => {
    try {
      const book = await Book.create(bookData);
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
        .populate("user_wishlist.book");

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
      const allUsers = await UserProfile.find();
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
      const allReviews = await Review.find();
      res.send(allReviews);
    } catch (e) {
      res.send(e.massage);
    }
  };
  run();
});

// delete cart
app.delete("/delete-cart", (req, res) => {
  const cartId = req.query.cid;
  const run = async () => {
    try {
      const deleteItem = await UserProfile.update({
        $pull: { user_cart: { _id: cartId } },
      });
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
  const run = async () => {
    try {
      const deleteItem = await UserProfile.update({
        $pull: { user_wishlist: { _id: wishlistId } },
      });
      res.send(deleteItem);
    } catch (e) {
      res.send(e.massage);
    }
  };
  run();
});

app.listen(port, () => {
  console.log(`BookShelf listening on port ${port}`);
});
