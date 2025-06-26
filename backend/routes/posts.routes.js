import { Router } from "express";
import {
  activeCheck,
  createPost,
  getAllPosts,
  deletePost,
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

router.route("/create_post").post(uploadMedia.single("media"), createPost);
router.route("/get_all_posts").get(getAllPosts);
router.route("/delete_post").delete(deletePost);

export default router;
