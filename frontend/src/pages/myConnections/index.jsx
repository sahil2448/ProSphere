import UserLayout from "@/layout/UserLayout";
import React from "react";
import DashboardLayout from "@/layout/DashboardLayout";

function myConnectionsPage() {
  return (
    <UserLayout>
      <DashboardLayout>
        {" "}
        <p>My connections page</p>
      </DashboardLayout>
    </UserLayout>
  );
}

export default myConnectionsPage;
