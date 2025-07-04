import { BASE_URL } from "@/config";
import {
  getAboutUser,
  getAllUserProfiles,
} from "@/config/redux/action/authAction";
import { createPost, getAllPosts } from "@/config/redux/action/postAction";
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
  const postState = useSelector((state) => state.post);

  const [postContent, setPostContent] = useState("");
  const [fileContent, setFileContent] = useState();

  const handlePostUpload = async () => {
    await dispatch(createPost({ file: fileContent, body: postContent }));
    setFileContent(null);
    setPostContent("");
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

  console.log(postState.posts);

  if (authState.user) {
    return (
      <UserLayout>
        <DashboardLayout>
          {" "}
          <div className="px-14 flex flex-col">
            <div className="flex justify-center items-center gap-5 bg-cyan-700/10 px-5 py-2  rounded-lg">
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
            <div className="flex flex-col h-full">
              {postState.posts.map((post, idx) => {
                return (
                  <div key={idx}>
                    {" "}
                    <p>{post.body}</p>
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
          {" "}
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
