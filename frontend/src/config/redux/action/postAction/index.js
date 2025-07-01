const { clientServer } = require("@/config");
const { createAsyncThunk } = require("@reduxjs/toolkit");

const getAllPosts = createAsyncThunk(
  "post/getAllPosts",
  async (_, thunkAPI) => {
    try {
      const posts = await clientServer.get("/posts");

      if (response) {
        return thunkAPI.fulfillWithValue(posts.data);
      }
    } catch (e) {
      return thunkAPI.rejectWithValue(e.response.data);
    }
  }
);

export { getAllPosts };
