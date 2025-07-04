import { BASE_URL } from "@/config";
import { getAboutUser } from "@/config/redux/action/authAction";
import { getAllPosts } from "@/config/redux/action/postAction";
import { setTokenIsPresent } from "@/config/redux/reducer/authReducer";
import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/UserLayout";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Skeleton } from "@/components/ui/skeleton";

function Dashboard() {
  const router = useRouter();
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);

  useEffect(() => {
    if (authState.isToken) {
      dispatch(getAllPosts());
      dispatch(getAboutUser({ token: localStorage.getItem("token") }));
    }
  }, [authState.isToken]);

  if (authState.user) {
    return (
      <UserLayout>
        <DashboardLayout>
          {" "}
          <div className="px-14">
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
              ></textarea>
              <input
                htmlFor="fileUpload"
                type="file"
                className="cursor-pointer bg-sky-700 rounded-full"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="white"
                  className="size-7"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
              </input>
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
