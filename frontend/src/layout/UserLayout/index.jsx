import Navbar from "../../Components/Navbar/index";
import React from "react";

function UserLayout({ children }) {
  return (
    <div className="flex flex-col gap-5 bg-gray-50">
      <Navbar />
      {children}
    </div>
  );
}

export default UserLayout;
