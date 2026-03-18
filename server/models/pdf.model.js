const mongoose = require("mongoose");

const pdfSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true },
    path: { type: String, required: true },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    embeddings: [
      {
        chunkId: String,
        chunk: String,
        embedding: [Number],
        page: Number,
        source: String,
      },
    ],
  },
  { timestamps: true }
);

const PDF = mongoose.model("PDF", pdfSchema);
module.exports = PDF;
