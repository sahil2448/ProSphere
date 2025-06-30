import { useRouter } from "next/router";
import React from "react";

function Navbar() {
  const router = useRouter();
  return (
    <div className="px-[2rem] h-[10vh]">
      <div className="flex justify-between items-center h-full">
        <h1
          className="text-2xl font-bold cursor-pointer"
          onClick={() => {
            router.push("/");
          }}
        >
          Pro Sphere
        </h1>
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
      </div>
    </div>
  );
}

export default Navbar;
