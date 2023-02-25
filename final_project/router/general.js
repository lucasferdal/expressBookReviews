const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
    //Write your code here
    const { username, password } = req.body;
    // check if username or password are missing
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
    
    // check if username already exists
    if (users.find(user => user.username === username)) {
      return res.status(400).json({ message: "Username already exists" });
    }
    
    // add new user to the list of users
    users.push({ username, password });
    
    return res.status(201).json({ message: "User registered successfully" })
});

const bookList = Object.values(books);
// Get the book list available in the shop
public_users.get('/', function (req, res) {
    //Write your code here
    return res.status(200).send(JSON.stringify(bookList, null, 2));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    //Write your code here
    const isbn = req.params.isbn
    return res.status(200).send(JSON.stringify(books[isbn], null, 2));
});

const bookKeys = Object.keys(books);
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    //Write your code here
    const author = req.params.author;
    const booksByAuthor = bookKeys.filter(key => books[key].author === author);

    const booksArray = books[booksByAuthor]
    return res.status(200).send(JSON.stringify(booksArray));

});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    //Write your code here
    const title = req.params.title
    const booksByTitle = bookKeys.filter(e => books[e].title === title)
    const findBook = bookList[booksByTitle]
    return res.status(300).send(JSON.stringify(findBook));
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    //Write your code here
    const isbn = req.params.isbn
    return res.status(300).send(JSON.stringify(books[isbn].reviews), null, 2)
});

module.exports.general = public_users;
