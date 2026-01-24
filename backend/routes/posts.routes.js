import { Router } from "express";
import {
  activeCheck,
  createPost,
  getAllPosts,
  deletePost,
  getCommentByPost,
  deleteCommentOfUser,
  incremetLikes,
  commentPost,
  test,
} from "../controllers/post.controller.js";

import multer from "multer";

const router = Router();

router.route("/").get(activeCheck);

const myStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const uploadMedia = multer({ storage: myStorage });
router.route("/test").get(test);
router.route("/create_post").post(uploadMedia.single("media"), createPost);
router.route("/posts").get(getAllPosts);
router.route("/delete_post").delete(deletePost);
router.route("/comment_post").post(commentPost);
router.route("/get_comment_by_post").get(getCommentByPost);
router.route("/delete_comment_of_user").delete(deleteCommentOfUser);
router.route("/increment_likes").post(incremetLikes);

export default router;
