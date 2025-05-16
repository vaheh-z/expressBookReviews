const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
    const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: 'Username and password are required' });
  }

  const user = users.find(
    (user) => user.username === username && user.password === password
  );

  if (!user) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  const accessToken = jwt.sign({ username: user.username }, 'access', {
    expiresIn: '1h',
  });

  req.session.authorization = {
    accessToken,
  };

  return res.status(200).json({ message: 'User successfully logged in' });
//   return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const review = req.body.review;

  if (!req.session.authorization) {
    return res.status(403).json({ message: 'User not logged in' });
  }

  const token = req.session.authorization.accessToken;
  const decoded = jwt.verify(token, 'access');
  const username = decoded.username;

  if (!review) {
    return res.status(400).json({ message: 'Review is required' });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: 'Book not found' });
  }

  books[isbn].reviews[username] = review;

  return res.status(200).json({
    message: 'Review added/modified successfully',
    reviews: books[isbn].reviews,
  });
//   return res.status(300).json({message: "Yet to be implemented"});
});

regd_users.delete('/auth/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;
  
    if (!req.session.authorization) {
      return res.status(403).json({ message: 'User not logged in' });
    }
  
    const token = req.session.authorization.accessToken;
    const decoded = jwt.verify(token, 'access');
    const username = decoded.username;
  
    if (!books[isbn]) {
      return res.status(404).json({ message: 'Book not found' });
    }
  
    if (!books[isbn].reviews[username]) {
      return res.status(404).json({ message: 'Review not found' });
    }
  
    delete books[isbn].reviews[username];
  
    return res.status(200).json({
      message: 'Review deleted successfully',
      reviews: books[isbn].reviews,
    });
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
