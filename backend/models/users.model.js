import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
  name: { type: String, requied: true },
  username: { type: String, requied: true, unique: true },
  email: { type: String, require: true, unique: true },
  password: { type: String, require: true },
  profilePicture: { type: String, default: "default.jpg" },
  //   createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() },
  token: { type: String, default: "" },
});

const User = mongoose.model("User", UserSchema);

export default User;
