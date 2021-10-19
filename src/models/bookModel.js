const mongoose = require("mongoose");

const objectId = mongoose.Types.ObjectId;


const { systemConfig } = require("../configs");

const { validator } = require("../utils");

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: "title is required", unique: true },
    excerpt: { type: String, required: "excerpt is required" },
    bookcover:{ type: String, required: "bookcover is required" },
    userId: { type: objectId, required: "userId is required", refs: "User" },
    ISBN: { type: String, required: "ISBN is requierd", unique: true },
    category: { type: String, require: "category is required" },
    subcategory: { type: String, require: "subcategory is required" },
    reviews: { type: Number, default: 0 },
    deletedAt: { type: Date, default: null },
    isDeleted: { type: Boolean, default: false },
    releasedAt: { type: Date, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Book", bookSchema, "books");
