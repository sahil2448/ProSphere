import Comment from "../models/comments.model.js";
import Post from "../models/posts.model.js";
import User from "../models/users.model.js";

const activeCheck = async (req, res) => {
  return res.status(200).json({ message: "Running" });
};

const test = async (req, res) => {
  return res.status(200).json({ message: "test is running successfully!" });
};
const createPost = async (req, res) => {
  try {
    const { token } = req.body;

    const user = await User.findOne({ token });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newPost = new Post({
      userId: user._id,
      body: req.body.body,
      media: req.file !== undefined ? req.file.filename : "",
      fileType: req.file !== undefined ? req.file.mimetype.split("/")[1] : "",
    });

    await newPost.save();
    console.log(newPost);
    return res.status(201).json({ message: "Post created successfully" });
  } catch (e) {
    return req.status(500).json({ message: e.message });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const allPosts = await Post.find().populate(
      "userId",
      "name username email profilePicture",
    );
    return res.json({ allPosts });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Fetch all posts:
// It uses Post.find() to get all post documents from the database.

// Populate user details:
// It uses .populate("userId", "name username email profilePicture") to replace the userId field in each post with the actual user’s basic info (name, username, email, profile picture) instead of just the user’s ID.

// Send response:
// It returns the list of all posts (with user info) as a JSON response.

const deletePost = async (req, res) => {
  try {
    const { token, postId } = req.query;

    const user = await User.findOne({ token }).select("_id");
    // .select("_id") is to only retrieve the _id field of the user document from the database, instead of fetching all user details.
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const post = await Post.findOne({ _id: postId });
    if (!post) {
      console.log("postid from backend", postId, "token:", token);

      return res.status(404).json({ message: "Post not found" });
    }

    if (String(user._id) !== String(post.userId)) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this post" });
    }

    await Post.deleteOne({ _id: postId });
    const allPosts = await Post.find().populate(
      "userId",
      "name username email profilePicture",
    );
    // ANOTHER METHOD TO HANDLE DELETPOST...WITHOUT DELETING THE POST:
    // We will write:
    // await Post.updateOne({ _id: postId }, { active: false });
    // and render only those post whose active field is true.
    return res
      .status(200)
      .json({ message: "Post deleted successfully", allPosts });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

const deleteCommentOfUser = async (req, res) => {
  const { token, commentId } = req.body;
  try {
    const user = await User.findOne({ token }).select("_id");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const comment = await Comment.findOne({ _id: commentId });
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (String(user._id) !== String(comment.userId)) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this comment" });
    }

    return res.status(200).json({ message: "Comment deleted successfully" });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

const incremetLikes = async (req, res) => {
  // Get postId and userId
  const { postId, userId } = req.body.params;
  console.log("the userId:", userId._id);
  try {
    const post = await Post.findOne({ _id: postId });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if user already liked
    if (post.likedBy.includes(userId._id)) {
      return res.status(400).json({ message: "You already liked this post" });
    }

    // Add userId to likedBy and increment likes
    post.likedBy.push(userId._id);
    post.likes += 1;
    await post.save();

    return res.status(200).json({
      message: "Likes Incremented",
      likes: post.likes,
      likedBy: post.likedBy,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const commentPost = async (req, res) => {
  const { token, postId, comment_body } = req.body;
  try {
    console.log("backend check:", { token, postId, comment_body });
    const user = await User.findOne({ token });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const post = await Post.findOne({ _id: postId });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const commentData = new Comment({
      userId: user._id,
      postId: postId,
      body: comment_body,
    });

    await commentData.save();

    return res.status(200).json({ message: "comment added" });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

const getCommentByPost = async (req, res) => {
  const { postId } = req.query;
  console.log("from backend:", postId);

  try {
    const post = await Post.findOne({ _id: postId });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const allComments = await Comment.find({ postId }).populate(
      "userId",
      "username name",
    );
    return res.json(allComments);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

export {
  activeCheck,
  createPost,
  getAllPosts,
  deletePost,
  commentPost,
  getCommentByPost,
  deleteCommentOfUser,
  test,
  incremetLikes,
};
