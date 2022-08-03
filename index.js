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
    book_author,
    book_publisher,
    book_pages,
    discount,
    book_price,
    book_qnt,
    book_category,
    cover_photo_url,
  } = req.body;
  const bookData = {
    book_title,
    book_description,
    book_edition,
    book_country,
    book_language,
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

app.post("/add-user", (req, res) => {
  const {
    displayName: user_name,
    uid,
    email: user_email,
    photoURL: user_photo_url,
  } = req.body.user;
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
        console.log(userProfile);
        res.send(userProfile);
      } else {
        res.send(existUser[0]);
      }
    } catch (e) {
      console.log(e.message);
      res.send(e.message);
    }
  };
  run();
});

app.post("/add-to-cart", (req, res) => {
  const { user_id, cart_data } = req.body;

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

app.put("/update-user", (req, res) => {
  const id = req.query.id;
  const {
    user_name: name,
    user_phone: phone,
    user_address: add,
    user_photo_url: ph_url,
  } = req.body;

  const run = async () => {
    try {
      const userData = await UserProfile.findById(id);
      if (name) {
        userData.user_name = name;
        await userData.save();
      }
      if (phone) {
        userData.user_phone = phone;
        await userData.save();
      }
      if (add) {
        userData.user_address = add;
        await userData.save();
      }
      if (ph_url) {
        userData.user_photo_url = ph_url;
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
        .populate("book_category.[]")
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
  console.log(id);
  const run = async () => {
    try {
      const book = await Book.where("_id")
        .equals(id)
        .populate("book_category.[]")
        .populate("book_author")
        .populate("book_publisher");
      console.log(book[0]);
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
      const book = await Book.where("book_category")
        .equals(ct)
        .populate("book_category.[]")
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
        .populate("book_category.[]")
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
        .populate("book_category.[]")
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
  console.log(sq);
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

app.listen(port, () => {
  console.log(`BookShelf listening on port ${port}`);
});
