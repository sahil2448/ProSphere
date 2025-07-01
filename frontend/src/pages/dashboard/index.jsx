import { getAllPosts } from "@/config/redux/action/postAction";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

function Dashboard() {
  const router = useRouter();
  const [isTokenPresent, setIsTokenPresent] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (localStorage.getItem("token") === null) {
      router.push("/login");
    }
    setIsTokenPresent(true);
  });

  useEffect(() => {
    if (isTokenPresent) {
      dispatch(getAllPosts());
    }
  });
  return (
    <div>
      <h1>Dashboard</h1>
    </div>
  );
}

export default Dashboard;
