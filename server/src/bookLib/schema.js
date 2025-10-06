
const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
   title:{
    type:String
   },
   author:{
    type:String
   },
   category:{
    type:String
   },
   published_date:{
    type:Date
   }
  },
  { timestamps: true }
);

const schema = mongoose.model("books", bookSchema);

module.exports = schema;
