const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios');
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: 'Username and password are required' });
  }

  if (users.find((user) => user.username === username)) {
    return res.status(400).json({ message: 'Username already exists' });
  }

  users.push({ username, password });
  return res.status(200).json({ message: 'User successfully registered' });
//   return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
  //Write your code here
  try {
    const response = await axios.get('http://localhost:5000/');
    return res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error getting books' });
  }
//   return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    //Write your code here
    try {
        const isbn = req.params.isbn;
        const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
        return res.status(200).json(response.data);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error getting book details' });
      }
  });
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
  //Write your code here
  const author = req.params.author;
  const matchingBooks = {};

  const isbns = Object.keys(books);

  for (let isbn of isbns) {
    if (books[isbn].author.toLowerCase() === author.toLowerCase()) {
      matchingBooks[isbn] = books[isbn];
    }
  }

  if (Object.keys(matchingBooks).length > 0) {
    return res.status(200).json(matchingBooks);
  } else {
    return res.status(404).json({ message: 'No books found for this author' });
  }
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
  //Write your code here
  const title = req.params.title;
  const matchingBooks = {};
  const isbns = Object.keys(books);
  for (let isbn of isbns) {
    if (books[isbn].title.toLowerCase() === title.toLowerCase()) {
      matchingBooks[isbn] = books[isbn];
    }
  }
  if (Object.keys(matchingBooks).length > 0) {
    return res.status(200).json(matchingBooks);
  } else {
    return res.status(404).json({ message: 'No books found with this title' });
  }
//   return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({ message: 'Book not found' });
  }
//   return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
