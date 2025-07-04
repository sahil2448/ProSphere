import { getAllUserProfiles } from "@/config/redux/action/authAction";
import { setTokenIsPresent } from "@/config/redux/reducer/authReducer";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

function DashboardLayout({ children }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  useEffect(() => {
    if (localStorage.getItem("token") === null) {
      router.push("/login");
    }
    dispatch(setTokenIsPresent());
  });

  useEffect(() => {
    if (!authState.allProfilesFetched) {
      dispatch(getAllUserProfiles());
    }
  }, []);

  const allUsers = authState.allUsers;
  const allFetched = authState.allProfilesFetched;
  // console.log(allUsers);

  return (
    <div className="flex">
      <div className="w-[20%] flex flex-col justify-center ">
        <div className="w-[80%] flex flex-col gap-2 justify-end self-end">
          <div
            onClick={() => router.push("/dashboard")}
            className="flex gap-2 text-[1.1rem] cursor-pointer hover:scale-105 items-center transition-all duration-200 "
          >
            <div className="h-[1.2em]">
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
                  d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                />
              </svg>
            </div>

            <p> Scroll</p>
          </div>
          <div
            onClick={() => router.push("/discover")}
            className="flex gap-2 text-[1.1rem] cursor-pointer hover:scale-105 items-center transition-all duration-200"
          >
            <div className="h-[1.2em]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
            </div>

            <p> Discover</p>
          </div>
          <div
            onClick={() => router.push("/myConnections")}
            className="flex gap-2 text-[1.1rem] cursor-pointer hover:scale-105 items-center transition-all duration-200"
          >
            <div className="h-[1.2em]">
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
                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                />
              </svg>
            </div>

            <p> My connections</p>
          </div>
        </div>
      </div>
      <div className="w-[60%]">{children}</div>
      <div className="w-[20%]">
        <h1>Top Profiles</h1>
        <div className="flex flex-col">
          {allFetched &&
            allUsers.map((person, idx) => {
              return <div key={idx}>{person.userId.name}</div>;
            })}
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
