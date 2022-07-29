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
    book_publisher,
    book_author,
    book_pages,
    discount,
    book_price,
    book_qnt,
    book_category,
    cover_photo_url,
  } = req.body;
  const bookData = {
    book_title,
    book_author,
    book_price,
    book_qnt,
    book_category,
    cover_photo_url,
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

app.post("/add-user", (req, res) => {
  const { user_name, uid, user_email, user_phone, user_role, user_photo_url } =
    req.body;
  const userData = {
    user_name,
    uid,
    user_email,
    user_phone,
    user_role,
    user_photo_url,
  };
  console.log("add user api hitted");
  const run = async () => {
    try {
      const userProfile = await UserProfile.create(userData);
      res.send(userProfile);
    } catch (e) {
      res.send(e.message);
    }
  };
  run();
});
app.put("/update-cart", (req, res) => {
  const { user_id, cart_data } = req.body;
  const run = async () => {
    try {
      const userProfile = await UserProfile.findById(user_id);
      userProfile.user_cart = [...cart_data];
      userProfile.save();
      res.send(userProfile);
    } catch (e) {
      res.send(e.message);
    }
  };
  run();
});
app.get("/get-cart-data", (req, res) => {
  const { user_id } = req.query.id;
  const run = async () => {
    try {
      const userProfile = await UserProfile.findById(user_id);
      const cartData = userProfile.cart_data;
      res.send(cartData);
    } catch (e) {
      res.send(e.message);
    }
  };
  run();
});

app.put("/update-wishlist", (req, res) => {
  const { user_id, wishlist_data } = req.body;
  const run = async () => {
    try {
      const userProfile = await UserProfile.create(categoryData);
      userProfile.user_wishlist = [...wishlist_data];
      userProfile.save();
      res.send(userProfile);
    } catch (e) {
      res.send(e.message);
    }
  };
  run();
});

app.get("/get-wishlist-data", (req, res) => {
  const { user_id } = req.query.id;
  const run = async () => {
    try {
      const userProfile = await UserProfile.findById(user_id);
      const wishlistData = userProfile.wishlist_data;
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

app.post("/get-user", (req, res) => {
  const { email } = req.body;
  console.log(email);
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

app.get("/all-books", (req, res) => {
  const run = async () => {
    try {
      const books = await Book.find();
      res.send(books);
    } catch (e) {
      res.send(e.massage);
    }
  };
  run();
});

app.listen(port, () => {
  console.log(`BookShelf listening on port ${port}`);
});
