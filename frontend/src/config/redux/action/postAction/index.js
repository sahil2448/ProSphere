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

const createPost = createAsyncThunk(
  "post/create_post",
  async (userData, thunkAPI) => {
    try {
      const { file, body } = userData;

      const formData = new FormData(); // Javascript provides a FormData class to handle form data
      formData.append("token", localStorage.getItem("token"));
      formData.append("body", body);
      formData.append("media", file);

      const response = await clientServer.post("/create_post", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status == 200) {
        return thunkAPI.fulfillWithValue("Post uploaded successfully !");
      } else {
        return thunkAPI.rejectWithValue("Post not uploaded !");
      }
    } catch (e) {
      return thunkAPI.rejectWithValue(e.response.data);
    }
  }
);

export { getAllPosts, createPost };
