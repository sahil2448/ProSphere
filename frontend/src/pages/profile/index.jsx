import { Button } from "../../Components/ui/button";
import { BASE_URL, clientServer } from "@/config";
import { getAboutUser } from "@/config/redux/action/authAction";
import { getAllPosts } from "@/config/redux/action/postAction";
import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/UserLayout";
import { ScrollArea } from "../../Components/ui/scroll-area";
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
} from "../../Components/ui/dialog";
import { Input } from "../../Components/ui/input";
import { Label } from "../../Components/ui/label";

function ProfilePage() {
  const [userProfile, setUserProfile] = useState({});
  const [userPosts, setUserPosts] = useState([]);
  const authState = useSelector((state) => state.auth);
  const postState = useSelector((state) => state.postReducer);
  const dispatch = useDispatch();
  const router = useRouter();

  const [inputData, setInputData] = useState({
    company: "",
    position: "",
    Year: "",
    school: "",
    degree: "",
    fieldOfStudy: "",
  });

  const handleWorkInputChange = (e) => {
    const { name, value } = e.target;
    setInputData({ ...inputData, [name]: value });
  };

  const handleEducationInputChange = (e) => {
    const { name, value } = e.target;
    setInputData({ ...inputData, [name]: value });
  };

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
  }, [authState.user, postState.posts, authState.user]);

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

  const handleDeleteEducation = (idx) => {
    const updatedEducation = (userProfile.education || []).filter(
      (_, i) => i !== idx
    );
    setUserProfile({
      ...userProfile,
      education: updatedEducation,
    });
  };
  const handleWorkDelete = (idx) => {
    const updatedPastwork = (userProfile.pastWork || []).filter(
      (_, i) => i !== idx
    );
    setUserProfile({
      ...userProfile,
      pastWork: updatedPastwork,
    });
  };

  return (
    <UserLayout>
      <DashboardLayout>
        <ScrollArea className="h-[100vh] w-[100%] border-none  p-0 mb-10">
          <div className=" flex h-full pb-20 flex-col gap-5 w-[100%] py-2 ">
            {authState.user && userProfile && userProfile.userId ? (
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

                  <div className="flex flex-col lg:flex-row gap-8 mt-16 px-5 sm:px-0">
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
                        {(userProfile.userId.name !==
                          authState.user.userId.name ||
                          userProfile.bio !== authState.user.bio) && (
                          <div className="flex mt-4">
                            <button
                              className="px-5 py-2 bg-black cursor-pointer text-white rounded shadow transition-all duration-150 text-base font-semibold"
                              onClick={updateProfileData}
                            >
                              Save
                            </button>
                          </div>
                        )}
                      </div>

                      {/* ---------- EDUCATION HISTORY (IMPROVED) --------- */}
                      <div className="flex flex-col gap-5">
                        <div>
                          <p className="font-bold text-lg  tracking-wide">
                            Education History
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-5">
                          {(userProfile.education || []).map((edu, idx) => (
                            <div
                              key={idx}
                              className="min-w-[260px] relative max-w-xs bg-gray-100 border border-gray-200 shadow-md px-6 py-5 rounded-lg flex flex-col gap-1"
                            >
                              <div>
                                <Button
                                  className="absolute right-3 top-3 cursor-pointer hover text-red-800 hover:text-red-600 hover:bg-neutral-200 "
                                  variant="ghost"
                                  onClick={() => handleDeleteEducation(idx)}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="size-5   "
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                    />
                                  </svg>
                                </Button>
                              </div>

                              <p className="text-base font-semibold">
                                {edu.school}
                              </p>
                              <div className="text-sm space-y-1 mt-1">
                                <div>
                                  <span className="text-gray-600 font-medium mr-1">
                                    Degree:
                                  </span>
                                  <span>{edu.degree}</span>
                                </div>
                                <div>
                                  <span className="text-gray-600 font-medium mr-1">
                                    Field:
                                  </span>
                                  <span>{edu.fieldOfStudy}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                          {(!userProfile.education ||
                            userProfile.education.length === 0) && (
                            <div className="text-gray-400 text-base my-4">
                              No education history added yet.
                            </div>
                          )}
                        </div>
                        <div className="flex gap-3">
                          {" "}
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                className="cursor-pointer  min-w-[8rem] w-fit"
                              >
                                Add Education
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                              <DialogHeader>
                                <DialogTitle>
                                  Fill all the information
                                </DialogTitle>
                                <DialogDescription>
                                  Anyone who has this link will be able to view
                                  this.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="flex flex-col  gap-2">
                                <div className="grid flex-1 gap-2">
                                  <Label htmlFor="text">School</Label>
                                  <Input
                                    id="school"
                                    onChange={handleEducationInputChange}
                                    name="school"
                                    placeholder="School Name ?"
                                  />
                                </div>
                                <div className="grid flex-1 gap-2">
                                  <Label htmlFor="text">Degree</Label>
                                  <Input
                                    id="degree"
                                    onChange={handleEducationInputChange}
                                    name="degree"
                                    placeholder="What Degree You Enrolled In ?"
                                  />
                                </div>
                                <div className="grid flex-1 gap-2">
                                  <Label htmlFor="text">Field of Study</Label>
                                  <Input
                                    id="fieldOfStudy"
                                    onChange={handleEducationInputChange}
                                    name="fieldOfStudy"
                                    placeholder="Field of Study ?"
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
                                <DialogClose asChild className="">
                                  <Button
                                    type="button"
                                    className="bg-black text-white cursor-pointer "
                                    onClick={() => {
                                      setUserProfile({
                                        ...userProfile,
                                        education: [
                                          ...(userProfile.education || []),
                                          {
                                            school: inputData.school,
                                            degree: inputData.degree,
                                            fieldOfStudy:
                                              inputData.fieldOfStudy,
                                          },
                                        ],
                                      });
                                    }}
                                  >
                                    Add Education{" "}
                                  </Button>
                                </DialogClose>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          <div>
                            {(userProfile.userId.name !==
                              authState.user.userId.name ||
                              (userProfile.education || []).length !==
                                (authState.user.education || []).length) && (
                              <div className="flex ">
                                <Button
                                  className="px-5  bg-black cursor-pointer text-white rounded shadow transition-all duration-150 text-base font-semibold"
                                  onClick={updateProfileData}
                                >
                                  Save
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      {/* -------- END EDUCATION HISTORY --------- */}

                      {/* ---------- PAST WORK (IMPROVED) --------- */}

                      <div className="flex flex-col gap-5">
                        <div>
                          <p className="font-bold text-lg tracking-wide">
                            Work History
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-5">
                          {(userProfile.pastWork || []).map((work, idx) => (
                            <div
                              key={idx}
                              className="min-w-[260px] relative max-w-xs bg-gray-100 border border-gray-200 shadow-md px-6 py-5 rounded-lg flex flex-col gap-1"
                            >
                              <div>
                                <Button
                                  className="absolute right-3 top-3 cursor-pointer hover text-red-800 hover:text-red-600 hover:bg-neutral-200 "
                                  variant="ghost"
                                  onClick={() => handleWorkDelete(idx)}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="size-5   "
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                    />
                                  </svg>
                                </Button>
                              </div>
                              <p className="text-base font-semibold">
                                {work.company}
                              </p>
                              <div className="text-sm space-y-1 mt-1">
                                <div>
                                  <span className="text-gray-600 font-medium mr-1">
                                    Position:
                                  </span>
                                  <span>{work.position}</span>
                                </div>
                                <div>
                                  <span className="text-gray-600 font-medium mr-1">
                                    Experience:
                                  </span>
                                  <span>{work.Year}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                          {(!userProfile.pastWork ||
                            userProfile.pastWork.length === 0) && (
                            <div className="text-gray-400 text-base my-4">
                              No work history added yet.
                            </div>
                          )}
                        </div>
                        <div className="flex gap-3">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                className="cursor-pointer min-w-[8rem] w-fit "
                              >
                                Add Work
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                              <DialogHeader>
                                <DialogTitle>
                                  Fill all the information
                                </DialogTitle>
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
                                    onChange={handleWorkInputChange}
                                    name="company"
                                    placeholder="Company Name ?"
                                  />
                                </div>
                                <div className="grid flex-1 gap-2">
                                  <Label htmlFor="text">Position</Label>
                                  <Input
                                    id="position"
                                    onChange={handleWorkInputChange}
                                    name="position"
                                    placeholder="What was your position/role ?"
                                  />
                                </div>
                                <div className="grid flex-1 gap-2">
                                  <Label htmlFor="text">Year</Label>
                                  <Input
                                    id="Year"
                                    onChange={handleWorkInputChange}
                                    name="Year"
                                    placeholder="How many years you worked ?"
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
                                <DialogClose asChild className="">
                                  <Button
                                    type="button"
                                    className="bg-black text-white cursor-pointer "
                                    onClick={() => {
                                      setUserProfile({
                                        ...userProfile,
                                        pastWork: [
                                          ...(userProfile.pastWork || []),
                                          {
                                            company: inputData.company,
                                            position: inputData.position,
                                            Year: inputData.Year,
                                          },
                                        ],
                                      });
                                    }}
                                  >
                                    Add Work
                                  </Button>
                                </DialogClose>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          <div>
                            {(userProfile.pastWork || []).length !==
                              (authState.user.pastWork || []).length && (
                              <div className="flex ">
                                <Button
                                  className="px-5 py-2 bg-black cursor-pointer text-white rounded shadow transition-all duration-150 text-base font-semibold"
                                  onClick={updateProfileData}
                                >
                                  Save
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      {/* -------- END PAST WORK --------- */}
                    </div>

                    <div className="w-full lg:w-1/3  flex flex-col gap-4">
                      <h2 className="font-semibold text-lg mb-2">
                        Recent Activity
                      </h2>
                      <div className=" h-64 md:h-72 w-full border border-gray-200 bg-gray-50 rounded-md shadow-inner overflow-hidden">
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
            ) : (
              <div>Loading...</div>
            )}
          </div>
        </ScrollArea>
      </DashboardLayout>
    </UserLayout>
  );
}

export default ProfilePage;
