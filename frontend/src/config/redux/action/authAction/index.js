const { createAsyncThunk } = require("@reduxjs/toolkit");
import { clientServer } from "@/config";
const loginUser = createAsyncThunk("user/login", async (user, thunkAPI) => {
  try {
    const response = clientServer.post("/users/login", {
      email: user.email,
      password: user.password,
    });

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
  async (user, thunkAPI) => {}
);

export { loginUser, registerUser };
