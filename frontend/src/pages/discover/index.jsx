import UserLayout from "@/layout/UserLayout";
import React, { useEffect } from "react";
import Dashboard from "../dashboard";
import DashboardLayout from "@/layout/DashboardLayout";
import { useDispatch, useSelector } from "react-redux";
import { getAllUserProfiles } from "@/config/redux/action/authAction";

function DiscoverPage() {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  useEffect(() => {
    if (!authState.allProfilesFetched) {
      dispatch(getAllUserProfiles());
    }
    const users = authState.allUsers;
  }, []);
  return (
    <UserLayout>
      <DashboardLayout>
        {" "}
        <p>Discover</p>
      </DashboardLayout>
    </UserLayout>
  );
}

export default DiscoverPage;
