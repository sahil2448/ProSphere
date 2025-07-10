import UserLayout from "@/layout/UserLayout";
import React, { useEffect } from "react";
import Dashboard from "../dashboard";
import DashboardLayout from "@/layout/DashboardLayout";
import { useDispatch, useSelector } from "react-redux";
import { getAllUserProfiles } from "@/config/redux/action/authAction";
import { BASE_URL } from "@/config";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { useRouter } from "next/router";

function DiscoverPage() {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  useEffect(() => {
    if (!authState.allProfilesFetched) {
      dispatch(getAllUserProfiles());
    }
  }, []);

  const router = useRouter();
  return (
    <UserLayout>
      <DashboardLayout>
        {
          <ScrollArea className="h-[90vh] w-[100%] mx-auto border-none  rounded-md pt-4 px-10 ">
            <div className=" flex flex-col gap-5 w-[95%] pb-5">
              {authState.allUsers.map((user, idx) => {
                return (
                  <div
                    key={idx}
                    onClick={() =>
                      router.push(`/viewProfile/${user.userId.username}`)
                    }
                    className="bg-white p-3 flex gap-5 cursor-pointer"
                    style={{ boxShadow: "10px 10px 10px 0px rgb(0,0,0,0.1)" }}
                  >
                    {" "}
                    <img
                      className="w-[4rem] border-1 rounded-full"
                      src={`${BASE_URL}/${user.userId.profilePicture}`}
                      alt=""
                    />
                    <div>
                      <p className="font-bold text-lg"> {user.userId.name}</p>
                      <p> @{user.userId.username}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        }
      </DashboardLayout>
    </UserLayout>
  );
}

export default DiscoverPage;
