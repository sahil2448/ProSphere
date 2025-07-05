import { createSlice } from "@reduxjs/toolkit";
import { deletePost, getAllPosts } from "../../action/postAction";

const initialState = {
  posts: [],
  isError: false,
  postFetched: false,
  loggedIn: false,
  isLoading: false,
  message: "",
  comments: [],
  postId: "",
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    reset: () => initialState,
    resetPostId: (state) => {
      state.postId = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllPosts.pending, (state, action) => {
        state.isLoading = true;
        state.message = "Fetching all posts...";
      })
      .addCase(getAllPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.postFetched = true;
        state.posts = action.payload;
      })
      .addCase(getAllPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = "Post deleted";
        state.posts = action.payload;
      });
  },
});

// The `action.payload` in your Redux slice comes from the **return value of your async thunk action**, which in this case is `getAllPosts` (imported from `../../action/postAction`).

// - When you dispatch `getAllPosts()`, it makes an API call (usually using `createAsyncThunk`).
// - The data returned from the API (usually `response.data`) becomes the `payload` of the fulfilled action.
// - In your reducer, `action.payload.posts` is set to the posts data returned by your backend.

export default postSlice.reducer;
