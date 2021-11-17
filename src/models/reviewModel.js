const mongoose = require("mongoose");

const objectId = mongoose.Types.ObjectId;

const reviewSchema = new mongoose.Schema(
  {
    bookId: { type: objectId, required: "bookId is required", refs: "Book" },
    reviewedBy: {
      type: String,
      required: "reviewedBy is required"
    },
    reviewedAt: { type: Date, required: true, default: new Date()  },
    rating: { type: Number, min: 1, max: 5, required: "rating is required" },
    review: { type: String },
    isDeleted:{ type: Boolean, default: false},
    deletedAt:{type: Date, default: null}
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema, "reviews");
