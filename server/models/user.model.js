const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },
    bio: {
      type: String,
      default: '',
      trim: true,
      maxlength: 280,
    },
    avatarUrl: {
      type: String,
      default: '',
      trim: true,
      maxlength: 2000000,
    },
    preferences: {
      theme: {
        type: String,
        enum: ['dark', 'light'],
        default: 'dark',
      },
      notificationsEnabled: {
        type: Boolean,
        default: true,
      },
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);
module.exports = User;
