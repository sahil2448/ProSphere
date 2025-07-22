import UserLayout from "@/layout/UserLayout";
import React, { useEffect } from "react";
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
        <ScrollArea className="h-[90svh] w-full mx-auto border-none rounded-md pt-4 px-2 sm:px-4 md:px-10">
          <div className="max-w-2xl mx-auto flex flex-col gap-3 md:gap-5 w-full pb-4">
            {authState.allUsers.map((user, idx) => (
              <div
                key={idx}
                onClick={() =>
                  router.push(`/viewProfile/${user.userId.username}`)
                }
                className="
                  bg-white p-3 sm:p-4 
                  flex flex-col sm:flex-row 
                  gap-2 sm:gap-5 items-center 
                  cursor-pointer shadow-md 
                  hover:shadow-lg transition-shadow 
                  rounded-xl border border-gray-100
                  hover:bg-gray-50
                "
                tabIndex={0} // Optional: keyboard-accessible
              >
                <img
                  className="w-16 h-16 md:w-20 md:h-20 object-cover border border-gray-200 rounded-full"
                  src={`${BASE_URL}/${user.userId.profilePicture}`}
                  alt={
                    user.userId.name
                      ? `${user.userId.name}'s profile`
                      : "User Profile"
                  }
                  loading="lazy"
                />
                <div className="flex-1 min-w-0 mt-2 sm:mt-0 text-center sm:text-left">
                  <p className="font-bold text-lg md:text-xl truncate">
                    {user.userId.name}
                  </p>
                  <p className="text-gray-600 text-sm truncate">
                    @{user.userId.username}
                  </p>
                </div>
              </div>
            ))}
            {authState.allUsers.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                No users found.
              </div>
            )}
          </div>
        </ScrollArea>
      </DashboardLayout>
    </UserLayout>
  );
}

export default DiscoverPage;
