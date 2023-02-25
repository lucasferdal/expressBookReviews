const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    return users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //const user = users.find(user => user.username === username);
    if (user) {
      return user.password === password;
    } else {
      return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const { username, password } = req.body;

  // check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Please provide a username and password" });
  }

  // check if the username is valid
  if (!isValid(username)) {
    return res.status(400).json({ message: "Invalid username" });
  }

  // check if the credentials match
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // create a JWT token
  const token = jwt.sign({ username }, "secret-key");

  // return the token as a response
  return res.status(200).json({ token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  
  const { isbn } = req.params;
  const { review } = req.query;
  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.verify(token, 'secret_key');
  const user = decoded.username;
  
  // Find the book with the given ISBN
  const book = books.find(b => b.isbn === isbn);
  
  if (!book) {
    return res.status(404).json({message: "Book not found"});
  }
  
  // Check if there's already a review for the book by the current user
  const existingReview = book.reviews.find(r => r.user === user);
  
  if (existingReview) {
    // If there's already a review, update it
    existingReview.review = review;
    return res.json({message: "Review updated successfully"});
  } else {
    // If there's no existing review, add a new one
    book.reviews.push({user, review});
    return res.json({message: "Review added successfully"});
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
