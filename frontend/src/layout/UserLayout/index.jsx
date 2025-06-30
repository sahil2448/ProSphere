import Navbar from "@/Components/Navbar";
import React from "react";

function UserLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

export default UserLayout;
