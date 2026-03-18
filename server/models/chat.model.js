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
    notebook: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Notebook",
      default: null,
    },
    question: { type: String, required: true },
    answer: { type: String, required: true },
    citations: [{ page: Number, source: String }],
  },
  { timestamps: true }
);

chatSchema.index({ user: 1, notebook: 1, createdAt: 1 });
chatSchema.index({ user: 1, pdf: 1, createdAt: 1 });

const Chat = mongoose.model("Chat", chatSchema);
module.exports = Chat;
