const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      // required: false,
    },
    text: { type: String, required: true },
    image: { type: String, require: true },
    name: { type: String, require: true },
    avatar: { type: String, require: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
        text: { type: String },
        name: { type: String },
        avatar: { type: String },
        date: { type: Date, default: Date.now() },
      },
    ],
  },
  { timestamps: true }
);

const Post = mongoose.model("post", PostSchema);
module.exports = Post;
