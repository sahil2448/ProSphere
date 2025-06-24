import User from "../models/users.model.js";
// import Profile from "../models/profile.model.js";
import Profile from "../models/profile.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import PDFDocument from "pdfkit";
import fs from "fs";

const convertUserDataToPDF = async (userData) => {
  const doc = new PDFDocument();
  const outputPath = crypto.randomBytes(32).toString("hex") + ".pdf";
  const stream = fs.createWriteStream("uploads/" + outputPath);
  doc.pipe(stream);

  doc.image("uploads/" + userData.profilePicture, {
    align: "center",
    width: 100,
  });

  doc.fontSize(14).text(`Name: ${userData.name}`, { align: "center" });
  doc.fontSize(14).text(`Username: ${userData.username}`, { align: "center" });
  doc.fontSize(14).text(`Email: ${userData.email}`, { align: "center" });
  doc.fontSize(14).text(`bio: ${userData.bio}`, { align: "center" });
  doc
    .fontSize(14)
    .text(`Current position: ${userData.currentPost}`, { align: "center" });
  doc.fontSize(14).text(`Past Work :`);
  userData.forEach((work, idx) => {
    doc.fontSize(14).text(`Company Name: ` + work.company);
    doc.fontSize(14).text(`Position: ` + work.position);
  });

  doc.end();
  return outputPath;
};

const register = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password) {
      return res.status(400).json({ message: "All fields are requires !" });
    }

    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User Already exists" });

    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = new User({
      name: name,
      username: username,
      email: email,
      password: hashedPassword,
    });
    await newUser.save();

    const newProfile = new Profile({
      userId: newUser._id,
    });

    await newProfile.save();

    return res.status(201).json({ message: "User registered successfully !" });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isValid = await bcrypt.compareSync(password, user.password);

    if (!isValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = crypto.randomBytes(32).toString("hex"); //This line generates a random 32-byte value (256 bits) and converts it to a hexadecimal string.

    await User.updateOne({ _id: user._id }, { token });

    return res.json({ token });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const uploadProfilePicture = async (req, res) => {
  const { token } = req.body;
  try {
    const user = await User.findOne({ token });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.profilePicture = req.file.filename;

    await user.save();
    return res
      .status(200)
      .json({ message: "Profile picture updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const { token, ...newUserData } = req.body; // token will be stored in token...and newUserData will be having other data of user
    const user = await User.findOne({ token });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const { username, email } = newUserData;

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existingUser) {
      if (existingUser || String(existingUser._id) !== String(user._id)) {
        return res
          .status(400)
          .json({ message: "Username or email already exists" });
      }
    }

    Object.assign(user, newUserData); // user ko newUserData assign kr diya
    await user.save();

    return res.json({ message: "User updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getUserAndProfle = async (req, res) => {
  try {
    const { token } = req.body;
    const user = await User.findOne({ token });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userProfile = await Profile.findOne({ userId: user._id }).populate(
      "userId",
      "name email username profilePicture"
    );

    await userProfile.save();

    return res.json(userProfile);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

const updateProfileData = async (req, res) => {
  try {
    const { token, ...newProfileData } = req.body;
    const user = await User.findOne({ token });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const profile_to_update = await Profile.findOne({ userId: user._id });

    Object.assign(profile_to_update, newProfileData);
    await profile_to_update.save();
    return res.json({ message: "Profile updated successfully" });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

const getAllUserProfile = async (req, res) => {
  try {
    const allUserProfile = await Profile.find().populate(
      "userId",
      "name username email profilePicture"
    );
    return res.json(allUserProfile);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

const downloadProfile = async (req, res) => {
  try {
    const user_id = req.query.id;
    const userProfile = await Profile.findOne({ userId: user_id }).populate(
      "userId",
      "name username email profilePicture"
    );

    const outputPath = await convertUserDataToPDF(userProfile);
    return res.json({ message: outputPath });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

export {
  register,
  Login,
  uploadProfilePicture,
  updateUserProfile,
  getUserAndProfle,
  updateProfileData,
  getAllUserProfile,
  downloadProfile,
};
