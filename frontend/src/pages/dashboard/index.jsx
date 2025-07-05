import { BASE_URL } from "@/config";
import {
  getAboutUser,
  getAllUserProfiles,
} from "@/config/redux/action/authAction";
import {
  createPost,
  deletePost,
  getAllPosts,
} from "@/config/redux/action/postAction";
import { setTokenIsPresent } from "@/config/redux/reducer/authReducer";
import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/UserLayout";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Skeleton } from "@/components/ui/skeleton";
import { Duru_Sans } from "next/font/google";

function Dashboard() {
  const router = useRouter();
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const postState = useSelector((state) => state.postReducer);
  const [buttonTriggered, setButtonTriggered] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [fileContent, setFileContent] = useState();

  const handlePostUpload = async () => {
    await dispatch(createPost({ file: fileContent, body: postContent }));
    setFileContent(null);
    setPostContent("");
    setButtonTriggered(!buttonTriggered);
  };

  const handleDeletePost = async (postId) => {
    await dispatch(
      deletePost({
        postId: postId._id,
      })
    );
  };

  useEffect(() => {
    if (authState.isToken) {
      dispatch(getAllPosts());
      dispatch(getAboutUser({ token: localStorage.getItem("token") }));
    }
    if (!authState.allProfilesFetched) {
      dispatch(getAllUserProfiles());
    }
  }, [authState.isToken]);

  useEffect(() => {
    dispatch(getAllPosts());
  }, [buttonTriggered]);

  // Fixed sorting: Changed to descending order (latest first)
  const posts = Array.isArray(postState?.posts?.allPosts)
    ? [...postState.posts.allPosts].sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt) // Swapped a and b
      )
    : [];

  posts.reverse();

  if (authState.user) {
    return (
      <UserLayout>
        <DashboardLayout>
          <div className="px-14 flex flex-col gap-5 h-[90vh]">
            <div className="flex justify-center items-center gap-5 bg-indigo-700/10 px-5 py-2 rounded-lg">
              <div>
                <img
                  src={`${BASE_URL}/${authState.user.userId.profilePicture}`}
                  alt=""
                  className="w-[4rem] rounded-full"
                />
              </div>
              <textarea
                name="text"
                className="w-full bg-white rounded-lg flex border-2 items-center justify-center p-2 min-h-16"
                id="text"
                placeholder="What's in your mind ?"
                onChange={(e) => setPostContent(e.target.value)}
                value={postContent}
              ></textarea>
              <div className="flex items-center gap-2">
                <label htmlFor="uploadFile" className="cursor-pointer ">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="white"
                    className="size-7 bg-sky-700 rounded-full"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                  <input
                    type="file"
                    onChange={(e) => setFileContent(e.target.files[0])}
                    hidden
                    id="uploadFile"
                  />
                </label>
                <button
                  onClick={handlePostUpload}
                  className={`cursor-pointer transition-all duration-700 ${
                    postContent.length != 0 ? "visible" : "hidden"
                  } bg-sky-700 px-2 py-1 text-white rounded-sm `}
                >
                  Post
                </button>
              </div>
            </div>
            <div className="flex flex-col h-full gap-5 ">
              {posts.map((post, idx) => {
                return (
                  <div
                    key={post._id || idx}
                    className="flex flex-col gap-2 px-3"
                  >
                    <div className="flex items-start gap-5 justify-start">
                      <img
                        src={`${BASE_URL}/${post.userId.profilePicture}`}
                        alt=""
                        width={"9%"}
                        className="rounded-full"
                      />
                      <div className="flex justify-between w-full">
                        <div>
                          <p className="font-bold">{post.userId.name}</p>
                          <p className="text-gray-600">
                            @ {post.userId.username}
                          </p>
                        </div>
                        {post.userId._id === authState.user.userId._id && (
                          <div
                            className="cursor-pointer"
                            onClick={() => handleDeletePost(post._id)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="size-6 text-red-800"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <p>{post.body}</p>
                      {post.media && (
                        <img src={`${BASE_URL}/${post.media}`} alt="" />
                      )}
                    </div>
                    <hr />
                  </div>
                );
              })}
            </div>
          </div>
        </DashboardLayout>
      </UserLayout>
    );
  } else {
    return (
      <UserLayout>
        <DashboardLayout>
          <div className="px-14">
            <SkeletonCard />
          </div>
        </DashboardLayout>
      </UserLayout>
    );
  }
}

export function SkeletonCard() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[125px] w-[250px] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[100%]" />
        <Skeleton className="h-4 w-[100%]" />
      </div>
    </div>
  );
}

export default Dashboard;
