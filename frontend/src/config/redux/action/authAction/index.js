const { createAsyncThunk } = require("@reduxjs/toolkit");
import { clientServer } from "@/config";
const loginUser = createAsyncThunk("user/login", async (user, thunkAPI) => {
  try {
    const response = await clientServer.post("user/login", {
      email: user.email,
      password: user.password,
    });
    // console.log(response);

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

//Passing the token in params ensures the backend receives it in the expected format/location, allowing it to authenticate and authorize the request properly. If your backend expects the token in headers, you should use the Authorization header instead. Always match your frontend request format to your backend's requirements.
const getAboutUser = createAsyncThunk(
  "user/get_user_and_profile",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.get("user/get_user_and_profile", {
        params: {
          token: user.token,
        },
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (e) {
      return thunkAPI.rejectWithValue(e.response.data);
    }
  }
);

const getAllUserProfiles = createAsyncThunk(
  "user/get_All_Users",
  async (_, thunkAPI) => {
    try {
      const response = await clientServer.get("user/get_All_Users");
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const sendConnectionRequest = createAsyncThunk(
  "user/send_connection_request",
  async (user, thunkAPI) => {
    try {
      console.log(user);
      const response = await clientServer.post("user/send_connection_request", {
        // params: {
        token: user.token,
        connectionId: user.connectionId,
        // },
      });

      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

const getConnectionRequest = createAsyncThunk(
  "user/getConnectionRequests",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.get("user/getConnectionRequests", {
        params: {
          token: user.token,
        },
      });
      return thunkAPI.fulfillWithValue(response.data.connections);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

const getMyConnectionsRequests = createAsyncThunk(
  "user/user_connection_request",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.get("user/user_connection_request", {
        params: {
          token: user.token,
        },
      });
      return thunkAPI.fulfillWithValue(response.data.connections);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

const AcceptConnection = createAsyncThunk(
  "user/accept_connection_request",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.get(
        "user/accept_connection_request",
        {
          params: {
            token: user.token,
            connection_id: user.connectionId,
            action_type: user.action,
          },
        }
      );

      return thunkAPI.fulfillWithValue(response.data);
    } catch (e) {
      return thunkAPI.rejectWithValue(e.response.data.message);
    }
  }
);

export {
  loginUser,
  registerUser,
  getAboutUser,
  getAllUserProfiles,
  sendConnectionRequest,
  getConnectionRequest,
  getMyConnectionsRequests,
  AcceptConnection,
};
