import { getAboutUser } from "@/config/redux/action/authAction";
import { getAllPosts } from "@/config/redux/action/postAction";
import { setTokenIsPresent } from "@/config/redux/reducer/authReducer";
import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/UserLayout";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

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
  return (
    <UserLayout>
      <DashboardLayout>
        {" "}
        <h1>Dashboard</h1>
      </DashboardLayout>
    </UserLayout>
  );
}

export default Dashboard;
