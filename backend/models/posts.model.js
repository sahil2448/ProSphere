import mongoose from "mongoose";

const PostSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  body: { type: String, requied: true },
  likes: { type: Number, require: true },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() },
  media: { type: String, default: "" },
  active: { type: Boolean, default: true },

  fileType: { type: String, default: "" },
});

// The active field in your Post schema is important for soft deletion and security:
// Soft Deletion: Instead of permanently deleting a post from the database, you can set active: false. This hides the post from users but keeps the data for auditing, recovery, or investigation.
// Prevents Data Loss: Accidentally deleted posts can be restored by setting active: true again.
// Audit & Moderation: Admins can review deactivated posts for abuse, spam, or policy violations.
// Security: Prevents unauthorized users from permanently removing evidence of malicious or inappropriate activity. You always have a record of all posts, even if they are not visible to regular users.

const Post = mongoose.model("Post", PostSchema);

export default Post;
