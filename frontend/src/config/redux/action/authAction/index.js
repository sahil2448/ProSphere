const { createAsyncThunk } = require("@reduxjs/toolkit");
import { clientServer } from "@/config";
const loginUser = createAsyncThunk("user/login", async (user, thunkAPI) => {
  try {
    const response = await clientServer.post("user/login", {
      email: user.email,
      password: user.password,
    });
    console.log(response);

    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    } else {
      return thunkAPI.rejectWithValue({
        message: "Token not provided",
      });
    }

    return thunkAPI.fulfillWithValue(response.data.token);
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response.data);
  }
});

const registerUser = createAsyncThunk(
  "user/register",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.post("user/register", {
        name: user.name,
        username: user.username,
        email: user.email,
        password: user.password,
      });

      console.log("User registered");
    } catch (e) {
      return thunkAPI.rejectWithValue(e.response.data);
    }
  }
);

export { loginUser, registerUser };
