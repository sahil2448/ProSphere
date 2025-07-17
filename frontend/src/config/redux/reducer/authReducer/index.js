const { createSlice } = require("@reduxjs/toolkit");
import {
  getAboutUser,
  getAllUserProfiles,
  getConnectionRequest,
  getMyConnectionsRequests,
  loginUser,
  registerUser,
  sendConnectionRequest,
} from "../../action/authAction/index.js";
const initialState = {
  user: undefined,
  isError: false,
  isLoading: false,
  isSuccess: false,
  loggedIn: false,
  message: "",
  profileFetched: false,
  allProfilesFetched: false,
  isToken: false,
  connections: [],
  connectionRequest: [],
  allUsers: [],
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: () => initialState,
    handleLoginUser: (state) => {
      state.message = "hello";
    },
    emptyMessage: (state) => {
      state.message = "";
    },
    setTokenIsPresent: (state) => {
      state.isToken = true;
    },
    setTokenIsNotPresent: (state) => {
      state.isToken = false;
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
        state.message = {
          message: "You are registered successfully! Please login",
        };
        state.isError = false;
        state.isSuccess = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.payload;
        state.isError = true;
        state.isSuccess = false;
        state.loggedIn = false;
      })
      .addCase(getAboutUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isError = false;
        state.isLoading = false;
        state.profileFetched = true;
      })
      .addCase(getAllUserProfiles.pending, (state, action) => {
        state.isError = false;
        state.isLoading = true;
      })
      .addCase(getAllUserProfiles.fulfilled, (state, action) => {
        state.allUsers = action.payload.allUserProfile;
        state.isError = false;
        state.allProfilesFetched = true;
        state.isLoading = false;
      })
      .addCase(sendConnectionRequest.fulfilled, (state, action) => {
        state.message = "Connection request sent successfully";
        // state.connectionRequest = action.payload;
      })
      .addCase(getConnectionRequest.fulfilled, (state, action) => {
        state.connections = action.payload;
      })
      .addCase(getConnectionRequest.rejected, (state, action) => {
        state.message = action.payload;
      })
      .addCase(getMyConnectionsRequests.fulfilled, (state, action) => {
        state.connectionRequest = action.payload;
        console.log("from reducer:", state.connectionRequest);
      })
      .addCase(getMyConnectionsRequests.rejected, (state, action) => {
        state.message = action.payload;
      });
  },
});

export const { reset, emptyMessage, setTokenIsPresent, setTokenIsNotPresent } =
  authSlice.actions;

export default authSlice.reducer;
