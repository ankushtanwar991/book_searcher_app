const express = require("express");
const { searchBooksController, autocompleteBooksController, addBookController, deleteBookController } = require("./bookLib/controller");

const router = express.Router();

router.post("/api/search", searchBooksController);
router.get("/api/autocomplete", autocompleteBooksController);
router.post("/api/books", addBookController);
router.delete("/api/books/:id", deleteBookController);

module.exports = router;
