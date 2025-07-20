import { Button } from "@/Components/ui/button";
import { BASE_URL, clientServer } from "@/config";
import { getAboutUser } from "@/config/redux/action/authAction";
import { getAllPosts } from "@/config/redux/action/postAction";
import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/UserLayout";
// import { ScrollArea } from "@radix-ui/react-scroll-area";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function ProfilePage() {
  const [userProfile, setUserProfile] = useState({});
  const [userPosts, setUserPosts] = useState([]);
  const authState = useSelector((state) => state.auth);
  const postState = useSelector((state) => state.postReducer);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
    dispatch(getAllPosts({ token: localStorage.getItem("token") }));
  }, []);

  useEffect(() => {
    setUserProfile(authState.user);

    if (authState.user) {
      let posts = Array.isArray(postState.posts.allPosts)
        ? postState.posts.allPosts.filter((post) => {
            return post.userId.username === authState.user.userId.username;
          })
        : [];

      setUserPosts(posts);
    }
  }, [authState.user, postState.posts.allPosts, authState.user]);

  const updateProfilePicture = async (file) => {
    const formData = new FormData();
    formData.append("profile_picture", file);
    formData.append("token", localStorage.getItem("token"));

    await clientServer.post("/user/update_profile_picture", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
  };

  const updateProfileData = async () => {
    await clientServer.post("/user/user_update", {
      token: localStorage.getItem("token"),
      name: userProfile.userId.name,
    });

    await clientServer.post("/user/update_profile_data", {
      token: localStorage.getItem("token"),
      bio: userProfile.bio,
      pastWork: userProfile.pastWork,
      currentPost: userProfile.currentPost,
      education: userProfile.education,
    });

    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
  };

  return (
    <UserLayout>
      <DashboardLayout>
        <ScrollArea className="h-[90vh] w-[100%]  border-none  p-0">
          <div className=" flex h-full flex-col gap-5 w-[100%] py-2 ">
            {authState.user && userProfile && (
              <div className=" bg-gray-50 px-2 sm:px-6 ">
                <div className="mx-auto max-w-6xl bg-white rounded-xl shadow-lg p-0 sm:p-8">
                  <div className="relative">
                    <img
                      src="https://images.pexels.com/photos/164175/pexels-photo-164175.jpeg"
                      alt="cover"
                      className="object-cover h-40 sm:h-40 w-full rounded-t-xl"
                    />
                    <label htmlFor="fileInput" className="cursor-pointer">
                      <div className="absolute -bottom-10 left-6 group flex items-center">
                        <img
                          src={`${BASE_URL}/${userProfile.userId.profilePicture}`}
                          alt="profile"
                          className="w-24 h-24 border-4 border-white object-cover rounded-full shadow-md bg-gray-200"
                        />
                        <div className="absolute bottom-2 left-2 flex items-center opacity-0 group-hover:opacity-100 bg-black bg-opacity-70 rounded-full px-3 py-1 text-xs text-white transition-all duration-200 cursor-pointer">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-4 h-4 mr-1"
                          >
                            <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
                          </svg>
                          Edit
                        </div>
                      </div>
                      <input
                        onChange={(e) =>
                          updateProfilePicture(e.target.files[0])
                        }
                        type="file"
                        className="hidden"
                        id="fileInput"
                      />
                    </label>
                  </div>

                  <div className="flex flex-col lg:flex-row gap-8 mt-16">
                    <div className="w-full lg:w-2/3 flex flex-col gap-6">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                        <input
                          type="text"
                          className="text-2xl font-semibold border-none bg-transparent focus:outline-none p-0"
                          value={userProfile.userId.name}
                          onChange={(e) =>
                            setUserProfile({
                              ...userProfile,
                              userId: {
                                ...userProfile.userId,
                                name: e.target.value,
                              },
                            })
                          }
                        />
                        <span className="text-md text-gray-500 font-medium pt-0.5">
                          @{userProfile.userId.username}
                        </span>
                      </div>
                      <textarea
                        className="
                      font-serif px-4 py-2 min-h-24 w-full max-w-2xl appearance-none
                      outline-none border border-gray-200 rounded-lg shadow-sm
                      focus:border-blue-500 focus:ring-2 focus:ring-blue-100
                      transition-all duration-200 bg-gray-50 text-gray-800
                      placeholder-gray-400 resize-y
                    "
                        value={userProfile.bio}
                        onChange={(e) =>
                          setUserProfile({
                            ...userProfile,
                            bio: e.target.value,
                          })
                        }
                        placeholder="Write a short bio about yourself..."
                      />
                      <div>
                        <p className="font-semibold mb-2">Work History</p>

                        <div className="flex flex-wrap gap-3">
                          {(userProfile.pastWork || []).map((work, idx) => (
                            <div
                              key={idx}
                              className="bg-gray-100 border border-gray-200 shadow-sm w-fit px-4 py-2 rounded-md"
                            >
                              <p className="text-sm">
                                <span className="font-semibold">Company: </span>
                                {work.company}
                              </p>
                              <p className="text-sm">
                                <span className="font-semibold">
                                  Position:{" "}
                                </span>
                                {work.position}
                              </p>
                              <p className="text-sm">
                                <span className="font-semibold">
                                  Year of Experience:{" "}
                                </span>
                                {work.Year}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                      {/* <Dialog variant="ghost" className="cursor-pointer  ">
                        <DialogTrigger
                          asChild
                          // onClick={async () =>
                          // }
                        >
                          <Button variant="ghost" className="cursor-pointer">
                            Add Work
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px] max-h-[80vh] min-h-[60vh] ">
                          <DialogHeader className="h-[60vh] ">
                            <DialogTitle></DialogTitle>
                            <DialogDescription className="absolute top-14 overflow-y-scroll w-[90%] h-[75%]">
                              <div>
                                {<div className="flex flex-col gap-5"></div>}
                              </div>
                            </DialogDescription>
                            <DialogFooter className="w-[90%] absolute bottom-2">
                              <Input
                                placeholder="Write your comment"
                                // onChange={}
                                // value={}
                                className="bg-white"
                              ></Input>
                              <Button
                                type="submit"
                                className="cursor-pointer"
                                // onClick={}
                              >
                                Add work
                              </Button>
                            </DialogFooter>
                          </DialogHeader>
                          <div className="grid gap-4"></div>
                        </DialogContent>
                      </Dialog> */}

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="cursor-pointer">
                            Add Work
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle>Fill all the information</DialogTitle>
                            <DialogDescription>
                              Anyone who has this link will be able to view
                              this.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="flex flex-col  gap-2">
                            <div className="grid flex-1 gap-2">
                              <Label htmlFor="text">Company Name</Label>
                              <Input
                                id="company"
                                name="company"
                                // defaultValue=""
                                placeholder="Company Name ?"
                              />
                            </div>
                            <div className="grid flex-1 gap-2">
                              <Label htmlFor="text">Position</Label>
                              <Input
                                id="position"
                                name="position"
                                // defaultValue=""
                                placeholder="What was you position/role ?"
                              />
                            </div>
                            <div className="grid flex-1 gap-2">
                              <Label htmlFor="text">Years</Label>
                              <Input
                                id="Years"
                                name="Years"
                                // defaultValue=""
                                placeholder="How many you worked ?"
                              />
                            </div>
                          </div>
                          <DialogFooter className=" sm:justify-start">
                            <DialogClose asChild>
                              <Button
                                type="button"
                                className="cursor-pointer"
                                variant="secondary"
                              >
                                Close
                              </Button>
                            </DialogClose>
                            <DialogClose asChild>
                              <Button
                                type="button"
                                className="bg-black text-white cursor-pointer"
                                // variant="ghost"
                              >
                                Save
                              </Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      {(userProfile.userId.name !==
                        authState.user.userId.name ||
                        userProfile.bio !== authState.user.bio) && (
                        <div className="flex mt-4">
                          <button
                            className="px-5 py-2 bg-black cursor-pointer text-white rounded shadow transition-all duration-150 text-base font-semibold"
                            onClick={updateProfileData}
                          >
                            Update Profile
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="w-full lg:w-1/3 flex flex-col gap-4">
                      <h2 className="font-semibold text-lg mb-2">
                        Recent Activity
                      </h2>
                      <div className="h-64 md:h-72 w-full border border-gray-200 bg-gray-50 rounded-md shadow-inner overflow-hidden">
                        <ScrollArea className="h-full w-full">
                          <div className="flex flex-col gap-4 p-3">
                            {(userPosts || []).map((post, idx) => (
                              <div
                                key={idx}
                                className="flex gap-3 items-start hover:bg-gray-100 rounded px-3 py-2 cursor-pointer transition"
                              >
                                <img
                                  src={`${BASE_URL}/${post.media}`}
                                  alt=""
                                  className="w-10 h-10 object-cover flex-shrink-0 rounded-md border border-gray-200 bg-white"
                                />
                                <p className="text-sm text-gray-700">
                                  {post.body}
                                </p>
                              </div>
                            ))}
                            {userPosts.length === 0 && (
                              <div className="text-gray-400 text-center py-6 text-sm">
                                No posts yet.
                              </div>
                            )}
                          </div>
                        </ScrollArea>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </DashboardLayout>
    </UserLayout>
  );
}

export default ProfilePage;
