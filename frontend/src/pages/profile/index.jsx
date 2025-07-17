import { BASE_URL } from "@/config";
import { getAboutUser } from "@/config/redux/action/authAction";
import { getAllPosts } from "@/config/redux/action/postAction";
import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/UserLayout";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

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
    console.log("authState", authState.user);
    setUserProfile(authState.user);
  }, [authState.user]);
  //   console.log("user", userProfile.userId);

  useEffect(() => {
    let posts = Array.isArray(postState.posts.allPosts)
      ? postState.posts.allPosts.filter((post) => {
          return post.userId.username === router.query.username;
        })
      : [];

    setUserPosts(posts);
  }, [postState.posts.allPosts, router.query.username]);
  return (
    <UserLayout>
      <DashboardLayout>
        {authState.user && userProfile && (
          <div className="h-[100vh] relative p-5 ">
            {" "}
            <div className="">
              <img
                src="https://images.pexels.com/photos/164175/pexels-photo-164175.jpeg"
                alt=""
                className="object-cover h-[27vh] w-full rounded-lg"
              />
              <img
                src={`${BASE_URL}/${userProfile.userId.profilePicture}`}
                alt=""
                className="w-[6em] h-[6em] absolute top-36 left-16 rounded-full bg-black"
              />
            </div>
            <div className="flex pt-10 w-full">
              <div className="w-[70%] flex flex-col gap-3">
                {" "}
                <div className="flex gap-4">
                  <p className="font-bold ">{userProfile.userId.name}</p>
                  <p>@{userProfile.userId.username}</p>
                </div>
                <div>
                  <p>{userProfile.bio}</p>
                </div>
                <div>
                  <p className="font-bold">Work History</p>
                  <div className="flex flex-wrap gap-3">
                    {userProfile.pastWork.map((work) => {
                      return (
                        <div
                          className="bg-white w-fit px-3 py-2 rounded-md"
                          style={{
                            boxShadow: "10px 10px 10px 0px rgb(0,0,0,0.1)",
                          }}
                        >
                          <p>Company Name : {work.company}</p>
                          <p>Position : {work.position}</p>
                          <p>Year of Experience : {work.Year}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="w-[30%] flex flex-col gap-5 ">
                <p className="font-bold">Recent Activity</p>
                <ScrollArea className="h-[40vh] w-[100%]  border-1 bg-white border-black rounded-md  ">
                  <div className="flex flex-col gap-5 pt-3 ">
                    {(userPosts || []).map((post, idx) => (
                      <div
                        key={idx}
                        className="flex gap-2 items-start hover:bg-gray-100 p-2 px-5 cursor-pointer"
                      >
                        <img
                          src={`${BASE_URL}/${post.media}`}
                          alt=""
                          className="w-10 h-10"
                        />
                        <p className="text-sm">{post.body}</p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>
        )}
      </DashboardLayout>
    </UserLayout>
  );
}

export default ProfilePage;
