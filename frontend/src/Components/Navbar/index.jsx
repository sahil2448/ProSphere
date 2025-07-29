import { reset } from "@/config/redux/reducer/authReducer";
import { useRouter } from "next/router";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../../Components/ui/button";
import { getAboutUser } from "@/config/redux/action/authAction";
import { getAllPosts } from "@/config/redux/action/postAction";

function Navbar() {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(reset());
    router.push("/login");
  };

  return (
    <nav
      className="sticky top-0 z-30 bg-white border-b border-slate-100 shadow-sm w-full transition-all duration-200"
      aria-label="Main navigation"
    >
      <div className=" mx-auto px-4 sm:px-8 h-[8vh] min-h-[56px] flex items-center justify-between">
        <h1
          className="text-xl sm:text-2xl font-bold text-slate-900 cursor-pointer tracking-wide"
          onClick={() => router.push("/")}
        >
          ProTweet
        </h1>
        <div className="flex items-center gap-4 sm:gap-6">
          {authState.profileFetched ? (
            <>
              <span className="hidden sm:block text-slate-700 text-base font-medium">
                Hey, {authState.user.userId.name}
              </span>
              <button
                onClick={() => router.push("/profile")}
                className="text-slate-900 cursor-pointer font-semibold hover:underline transition-all text-sm sm:text-base"
                aria-label="Go to Profile "
              >
                Profile
              </button>
              <Button
                variant="destructive"
                onClick={handleLogout}
                className="!bg-red-700 hover:!bg-red-800 cursor-pointer !text-white px-3 py-2 sm:px-4 sm:py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-400 text-sm"
              >
                Logout
              </Button>
            </>
          ) : (
            <button
              onClick={() => {
                router.push("/login");
                dispatch(
                  getAboutUser({ token: localStorage.getItem("token") })
                );
                dispatch(getAllPosts({ token: localStorage.getItem("token") }));
              }}
              className="bg-blue-900 hover:bg-blue-950 text-white font-semibold px-4 py-2 rounded transition-all text-sm sm:text-base shadow cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Be a part
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
