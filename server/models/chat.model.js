const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    pdf: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PDF",
      required: true,
    },
    question: { type: String, required: true },
    answer: { type: String, required: true },
    citations: [{ page: Number, source: String }],
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", chatSchema);
module.exports = Chat;
