const Book = require("./schema");
const { Client } = require("@elastic/elasticsearch");
const { indexBooks, deleteBookFromIndex } = require("../../libs/elasticsearch");

const client = new Client({
  node: "http://localhost:9200",
});

module.exports = {
  addBook: async (data) => {
    try {
      const book = new Book(data);
      const saved = await book.save();
      await indexBooks(saved);
      return saved;
    } catch (e) {
      console.error("Error adding book:", e);
      return e;
    }
  },

  getBooks: async () => {
    try {
      return await Book.find({});
    } catch (e) {
      console.error("Failed to get books:", e);
      return e;
    }
  },

  searchBooks: async ({ query, category, author, page = 1, size = 10 }) => {
    try {
      const must = [];

      if (query) {
        must.push({
          bool: {
            should: [
              { match: { title: { query, fuzziness: "AUTO" } } },
              { match: { author: { query, fuzziness: "AUTO" } } },
              { match: { "title.phonetic": { query } } },
              { match: { "author.phonetic": { query } } },
            ],
          },
        });
      }

      if (category) must.push({ term: { category } });
      if (author) must.push({ match: { author } });

      const body = {
        query: { bool: { must } },
        aggs: {
          authors: { terms: { field: "author.keyword" } },
          years: {
            date_histogram: { field: "published_date", calendar_interval: "year" },
          },
        },
        from: (page - 1) * size,
        size,
      };

      const res = await client.search({ index: "books", body });
      const hits = res.body.hits.hits.map((h) => ({ ...h._source, _id: h._id }));
 const aggregations = res.body.aggregations;
      return {
        total: res.body.hits.total.value,
        hits,
        aggregations
      };
    } catch (e) {
      console.error("Search books failed:", e);
      return e;
    }
  },

  autocompleteBooks: async (prefix) => {
    try {
      console.log("Autocomplete prefix:", prefix);
      const body = {
      suggest: {
          book_suggest: {
            prefix,
            completion: {
              field: "title",
              fuzzy: { fuzziness: "AUTO" },
            },
          },
        },
      };
      const res = await client.search({ index: "books", body });
      const opts = res.body.suggest.book_suggest[0].options;
      return opts.map((o) => o.text);
    } catch (e) {
      console.error("Autocomplete error:", e);
      return e;
    }
  },

  deleteBook: async (id) => {
    try {
      const deleted = await Book.findByIdAndDelete(id);
      if (deleted) await deleteBookFromIndex(id);
      return deleted;
    } catch (e) {
      console.error("Delete book error:", e);
      return e;
    }
  },
};
