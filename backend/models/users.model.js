import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
  name: { type: string, requied: true },
  username: { type: string, requied: true, unique: true },
  email: { type: string, require: true, unique: true },
  password: { type: string, require: true },
  profilePicture: { type: string, default: "default.jpg" },
  //   createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() },
  token: { type: string, default: "" },
});

const User = mongoose.model("User", UserSchema);

export default User;
