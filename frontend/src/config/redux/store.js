import { configureStore } from "@reduxjs/toolkit";
import authRedcer from "./reducer/authReducer";
import postReducer from "./reducer/postReducer";
/**
 * STEPS FOR STATE MANAGEMENT:
 * Submit action
 * Handle action in it's reducer
 * Register here -> Reducer
 *
 */

export const store = configureStore({
  reducer: {
    auth: authRedcer,
    postReducer: postReducer,
  },
});
