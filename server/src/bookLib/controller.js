const { searchBooks, autocompleteBooks, addBook, deleteBook } = require("./service");

const searchBooksController = async (req, res) => {
  try {
    const { query, category, author, page, size } = req.body;
    const pageNum = page ? parseInt(page) : 1;
    const pageSize = size ? parseInt(size) : 10;

    const results = await searchBooks({ query, category, author, page: pageNum, size: pageSize });

    res.json(results);
  } catch (err) {
    console.error("Search controller error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

const autocompleteBooksController = async (req, res) => {
  try {
    const prefix = req.query.prefix;
    if (!prefix) {
      return res.status(400).json({ error: "Prefix query missing" });
    }
    const suggestions = await autocompleteBooks(prefix);
    res.json({ suggestions });
  } catch (err) {
    console.error("Autocomplete controller error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

const addBookController = async (req, res) => {
  try {
    const bookData = req.body;
    const newBook = await addBook(bookData);
    res.status(201).json(newBook);
  } catch (err) {
    console.error("Add book controller error:", err);
    res.status(500).json({ error: "Failed to add book" });
  }
};

const deleteBookController = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBook = await deleteBook(id);
    if (!deletedBook) {
      return res.status(404).json({ error: "Book not found" });
    }
    res.json({ message: "Book deleted", book: deletedBook });
  } catch (err) {
    console.error("Delete book controller error:", err);
    res.status(500).json({ error: "Failed to delete book" });
  }
};

module.exports = {
  searchBooksController,
  autocompleteBooksController,
  addBookController,
  deleteBookController
};
