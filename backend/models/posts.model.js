import mongoose from "mongoose";

const PostSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  body: { type: string, requied: true },
  likes: { type: Number, require: true },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() },
  media: { type: string, default: "" },
  active: { type: Boolean, default: true },
  fileType: { type: string, default: "" },
});

const Post = mongoose.model("Post", PostSchema);

export default Post;
