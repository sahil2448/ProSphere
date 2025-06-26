import { Router } from "express";
import {
  register,
  Login,
  uploadProfilePicture,
  updateUserProfile,
  getUserAndProfle,
  updateProfileData,
  getAllUserProfile,
  downloadProfile,
  sendConnectionRequest,
  getMyConnectionsRequests,
  whatAreMyConnections,
  acceptConnectionRequest,
} from "../controllers/user.controller.js";
import multer from "multer";

const router = Router();

// If a user uploads a profile picture, Multer storage will save that image to a folder on your server and provide info about the file to your backend code.

const myStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // cb-> callback
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: myStorage });

router
  .route("/update_profile_picture")
  .post(upload.single("profile_picture"), uploadProfilePicture);

router.route("/register").post(register);
router.route("/login").post(Login);
router.route("/user_update").post(updateUserProfile);
router.route("/get_user_and_profile").get(getUserAndProfle);
router.route("/update_profile_data").post(updateProfileData);
router.route("/user/get_All_Users").get(getAllUserProfile);
router.route("/user/download_resume").get(downloadProfile);
router.route("/user/send_connection_request").get(sendConnectionRequest);
router.route("/user/getConnectionRequests").get(getMyConnectionsRequests);
router.route("/user/user_connection_request").get(whatAreMyConnections);
router.route("/user/accept_connection_request").get(acceptConnectionRequest);
export default router;
