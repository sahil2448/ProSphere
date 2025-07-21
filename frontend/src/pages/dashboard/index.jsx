import { BASE_URL } from "@/config";
import {
  getAboutUser,
  getAllUserProfiles,
} from "@/config/redux/action/authAction";
import {
  createPost,
  deletePost,
  getAllComments,
  getAllPosts,
  incremetLikes,
  postComment,
} from "@/config/redux/action/postAction";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { setTokenIsPresent } from "@/config/redux/reducer/authReducer";
import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/UserLayout";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/Components/ui/input";

function Dashboard() {
  const router = useRouter();
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const postState = useSelector((state) => state.postReducer);
  const [buttonTriggered, setButtonTriggered] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [fileContent, setFileContent] = useState("");
  const [likeActive, setLikeActive] = useState(false);
  const [commentText, setCommentText] = useState("");

  const handlePostUpload = async () => {
    await dispatch(createPost({ file: fileContent, body: postContent }));
    setFileContent(null);
    setPostContent("");
    setButtonTriggered(!buttonTriggered);
    setFileContent("");
  };

  const handleDeletePost = async (post) => {
    await dispatch(
      deletePost({
        postId: post._id,
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
          <ScrollArea className=" h-[90vh] w-[100%] mx-auto border-none rounded-md pt-4 px-10">
            <div className="flex w-[100%] items-start gap-5 bg-white border-2 px-5 py-3 rounded-lg">
              <div className="w-[5rem]">
                <img
                  src={`${BASE_URL}/${authState.user.userId.profilePicture}`}
                  alt=""
                  className="w-[4rem] h-[4rem] border-1 rounded-full"
                />
              </div>
              <div className="w-full flex flex-col gap-5">
                <textarea
                  name="text"
                  className="w-[100%] bg-gray-100 rounded-lg flex border-2 items-center justify-center p-2 min-h-20"
                  id="text"
                  placeholder="What's in your mind ?"
                  onChange={(e) => setPostContent(e.target.value)}
                  value={postContent}
                ></textarea>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <label htmlFor="uploadFile" className="cursor-pointer ">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="white"
                        className="size-8 p-1 bg-black  rounded-full"
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
                    {fileContent !== "" ? (
                      <div className="flex border-2 gap-2 justify-center items-center border-black rounded-xl px-3  bg-gray-100">
                        <div>File Attached</div>
                        <button
                          onClick={() => setFileContent("")}
                          className="cursor-pointer"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                            />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>

                  <button
                    onClick={
                      postContent.length !== 0 || fileContent !== ""
                        ? handlePostUpload
                        : undefined
                    }
                    className={`cursor-pointer transition-all duration-500 ${
                      postContent.length != 0 || fileContent !== ""
                        ? "bg-gray-800 text-white"
                        : "bg-gray-100 text-gray-400"
                    }  px-5 py-1  rounded-sm `}
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
            <div className="flex flex-col h-full gap-5 mt-5 pb-3">
              {posts.map((post, idx) => {
                return (
                  <div
                    key={post._id || idx}
                    className="flex flex-col gap-2 justify-start bg-white p-5 px-7 rounded-lg border-2"
                  >
                    <div className="flex items-start gap-5 justify-start">
                      <img
                        src={`${BASE_URL}/${post.userId.profilePicture}`}
                        alt=""
                        className="w-[4rem] border-1 rounded-full"
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
                            onClick={() => handleDeletePost(post)}
                          >
                            <Button
                              variant="outline"
                              className="text-red-600 cursor-pointer border-red-600 hover:text-red-700"
                              onClick={() =>
                                toast("Post has been deleted successfully!", {
                                  action: {
                                    label: "X",
                                    onClick: () => console.log("X"),
                                  },
                                })
                              }
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="size-5"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                />
                              </svg>
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <p>{post.body}</p>
                      {post.media && (
                        <img
                          className="rounded-lg"
                          src={`${BASE_URL}/${post.media}`}
                          alt=""
                        />
                      )}
                    </div>
                    <hr />

                    <div className="flex justify-evenly">
                      <Button
                        variant={`${"ghost"}`}
                        className="cursor-pointer flex gap-2"
                        onClick={async () => {
                          await dispatch(incremetLikes({ post }));
                          await dispatch(getAllPosts());
                          setLikeActive(true);
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z"
                          />
                        </svg>
                        {post.likes}
                      </Button>
                      {/* <Button> */}
                      <Dialog variant="ghost" className="cursor-pointer ">
                        <DialogTrigger
                          asChild
                          onClick={async () =>
                            await dispatch(getAllComments({ post }))
                          }
                        >
                          <Button variant="ghost" className="cursor-pointer">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="size-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z"
                              />
                            </svg>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px] max-h-[80vh] min-h-[60vh] ">
                          <DialogHeader className="h-[60vh] ">
                            <DialogTitle>
                              {postState.comments.length === 0
                                ? "No Comments"
                                : "Comments"}
                            </DialogTitle>
                            <DialogDescription className="absolute top-14 overflow-y-scroll w-[90%] h-[75%]">
                              <div>
                                {
                                  <div className="flex flex-col gap-5">
                                    {postState.comments.map((comment, idx) => {
                                      return (
                                        <div key={idx}>
                                          <div className="flex">
                                            <img
                                              src={`${BASE_URL}/${post.userId.profilePicture}`}
                                              alt=""
                                              className="rounded-full h-[40px]"
                                            />
                                            <div>
                                              <p className="font-bold text-black">
                                                {comment.userId.name}
                                              </p>
                                              <p className="text-black">
                                                @{comment.userId.username}
                                              </p>
                                              <p className="text-black">
                                                {comment.body}
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                }
                              </div>
                            </DialogDescription>
                            <DialogFooter className="w-[90%] absolute bottom-2">
                              <Input
                                placeholder="Write your comment"
                                onChange={(e) => setCommentText(e.target.value)}
                                value={commentText}
                                className="bg-white"
                              ></Input>
                              <Button
                                type="submit"
                                className="cursor-pointer"
                                onClick={async () => {
                                  await dispatch(
                                    postComment({
                                      post,
                                      comment_body: commentText,
                                    })
                                  );
                                  await dispatch(getAllComments({ post }));
                                  setCommentText("");
                                }}
                              >
                                Comment
                              </Button>
                            </DialogFooter>
                          </DialogHeader>
                          {/* <div className="grid gap-4"></div> */}
                        </DialogContent>
                      </Dialog>
                      {/* </Button> */}
                      <Button variant="ghost" className="cursor-pointer">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
                          />
                        </svg>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
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
