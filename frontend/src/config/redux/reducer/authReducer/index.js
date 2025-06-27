const { createSlice } = require("@reduxjs/toolkit");
import { loginUser, registerUser } from "../../action/authAction/index.js";
const initialState = {
  user: [],
  isError: false,
  isLoading: false,
  isSuccess: false,
  loggedIn: false,
  message: "",
  profileFetched: false,
  connections: [],
  connectionRequest: [],
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: () => initialState,
    handleLoginUser: (state) => {
      state.message = "hello";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.message = "knocking the door";
      })
      .addCase(loginUser.fulfilled, (state) => {
        state.isLoading = false;
        state.message = "User logged in";
        state.isError = false;
        state.isSuccess = true;
        state.loggedIn = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.payload;
        state.isError = true;
        state.isSuccess = false;
        state.loggedIn = false;
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.message = "Registering you...";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = "User registered successfully";
        state.isError = false;
        state.isSuccess = true;
        state.loggedIn = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.payload;
        state.isError = true;
        state.isSuccess = false;
        state.loggedIn = false;
      });
  },
});

export default authSlice.reducer;
