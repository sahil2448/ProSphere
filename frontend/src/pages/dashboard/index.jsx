import { getAboutUser } from "@/config/redux/action/authAction";
import { getAllPosts } from "@/config/redux/action/postAction";
import UserLayout from "@/layout/UserLayout";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function Dashboard() {
  const router = useRouter();
  const [isTokenPresent, setIsTokenPresent] = useState(false);
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);

  useEffect(() => {
    if (localStorage.getItem("token") === null) {
      router.push("/login");
    }
    setIsTokenPresent(true);
  });

  useEffect(() => {
    if (isTokenPresent) {
      dispatch(getAllPosts());
      dispatch(getAboutUser({ token: localStorage.getItem("token") }));
    }
  });
  return (
    <UserLayout>
      {authState.profileFetched && <div>Hey,{authState.user.userId.name}</div>}
    </UserLayout>
  );
}

export default Dashboard;
