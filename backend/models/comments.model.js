import mongoose from "mongoose";
// comment ko pata hai ki konse post ke andar jana hai aur konse user ne bheja hai..!
const commentSchema = new mongoose.Schema({
  userId: {
    // kisne bheja
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  postId: {
    // kis post pr muze show krna hai ye
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
  },
  body: {
    type: String,
    required: true,
  },
});

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
