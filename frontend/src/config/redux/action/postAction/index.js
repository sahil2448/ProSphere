const { clientServer } = require("@/config");
const { createAsyncThunk } = require("@reduxjs/toolkit");

const getAllPosts = createAsyncThunk(
  "post/getAllPosts",
  async (_, thunkAPI) => {
    try {
      const response = await clientServer.get("/posts");

      if (response) {
        return thunkAPI.fulfillWithValue(response.data);
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

const deletePost = createAsyncThunk(
  "/post/delete_post",
  async ({ postId }, thunkAPI) => {
    try {
      console.log(postId);
      const response = await clientServer.delete(`/delete_post`, {
        params: {
          token: localStorage.getItem("token"),
          postId: postId,
        },
      });
      if (response.status == 200) {
        return thunkAPI.fulfillWithValue(response.data);
      } else {
        return thunkAPI.rejectWithValue("Post not deleted !");
      }
    } catch (e) {
      return thunkAPI.rejectWithValue(e.response.data);
    }
  }
);

const incremetLikes = createAsyncThunk(
  "/post/increment_likes",
  async ({ post }, thunkAPI) => {
    try {
      console.log("from inc likes:", post._id);
      const response = await clientServer.post("/increment_likes", {
        params: {
          postId: post._id,
        },
      });

      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const getAllComments = createAsyncThunk(
  "post/get_comment_by_post",
  async ({ post }, thunkAPI) => {
    try {
      console.log(post._id);
      const response = await clientServer.get("/get_comment_by_post", {
        params: {
          postId: post._id,
        },
      });

      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const postComment = createAsyncThunk(
  "post/comment",
  async ({ post, comment_body }, thunkAPI) => {
    console.log("frontend check:", comment_body);
    try {
      const response = await clientServer.post("/comment_post", {
        token: localStorage.getItem("token"),
        postId: post._id,
        comment_body,
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);



export {
  getAllPosts,
  createPost,
  deletePost,
  incremetLikes,
  getAllComments,
  postComment,
};
