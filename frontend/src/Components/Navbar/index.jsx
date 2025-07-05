import { reset } from "@/config/redux/reducer/authReducer";
import { useRouter } from "next/router";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";

function Navbar() {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const router = useRouter();
  const handleLogout = () => {
    localStorage.removeItem("token");
    // router.push("/login");
    dispatch(reset());
  };
  return (
    <div className="px-[2rem] h-[12vh] bg-white sticky top-0 ">
      <div className="flex justify-between items-center h-full">
        <h1
          className="text-2xl font-bold cursor-pointer"
          onClick={() => {
            router.push("/");
          }}
        >
          Pro Sphere
        </h1>
        {authState.profileFetched && (
          <div className="flex items-center gap-5">
            {" "}
            <div>Hey, {authState.user.userId.name}</div>
            <p className="font-bold cursor-pointer">Profile</p>
            <Button
              variant="destructive"
              onClick={handleLogout}
              className="bg-red-700 hover:bg-red-800 w-fit h-fit px-3 py-2 cursor-pointer text-white transition-all rounded-sm duration-200"
            >
              <p>Logout</p>
            </Button>
          </div>
        )}
        {!authState.profileFetched && (
          <div>
            <div
              onClick={() => {
                router.push("/login");
              }}
              className="font-bold text-[15px] cursor-pointer border-2 p-2 rounded-md text-indigo-700 border-indigo-700 hover:bg-indigo-700 transition-all duration-200 hover:text-white"
            >
              Be a part
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;
