import { BASE_URL, clientServer } from "@/config";
import UserLayout from "@/layout/UserLayout";
import { useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import DashboardLayout from "@/layout/DashboardLayout";

function viewProfilePage({ userProfile }) {
  useEffect(() => {
    console.log("viewProfilePage");
  });
  const searchParams = useSearchParams();

  return (
    <UserLayout>
      <DashboardLayout>
        <div>
          {" "}
          <div className="px-5 relative">
            <img
              src="https://images.pexels.com/photos/164175/pexels-photo-164175.jpeg"
              alt=""
              className="object-cover h-[30vh] w-full"
            />
            <img
              src={`${BASE_URL}/${userProfile.userId.profilePicture}`}
              alt=""
              className="w-20 h-20 absolute bottom-10 left-0"
            />
          </div>
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}

export async function getServerSideProps(context) {
  console.log("viewProfilePage_serverSide"); // will show in frontend server(terminal)
  console.log(context.query.username);
  const request = await clientServer.get("/user/getProfileUsingUsername", {
    params: {
      username: context.query.username,
    },
  });

  const response = await request.data;
  console.log(response);
  return { props: { userProfile: response.profile } };
}

export default viewProfilePage;

// 1. getServerSideProps Function
// This function runs on the server every time someone visits the page.
// It receives a context object, which contains information about the request, including URL parameters.
// You extract the username from context.query.username.
// You make an API call to your backend (/user/getProfileUsingUsername) with the username as a query parameter.
// You get the user profile data from the backend response.
// You return the data as props to your page component.
// This means:
// When a user visits /viewProfile/someusername, Next.js will:

// Run getServerSideProps on the server,
// Fetch the profile for someusername,
// Pass it as a prop (userProfile) to your React component.

// 2. viewProfilePage Component
// Receives userProfile as a prop from getServerSideProps.
// On mount, logs "viewProfilePage" to the browser console.
// Uses userProfile.userId.name to display the user's name.

// 3. useSearchParams
// You import and call useSearchParams from Next.js, but in this code, you’re not using its value. (It’s safe to remove unless you plan to use query params from the URL on the client side.)
// Summary
// Server-side: Fetches user profile based on the username in the URL.
// Client-side: Displays the user’s name using the data fetched on the server.
// Benefit: The page is pre-rendered with user data, improving SEO and initial load speed.
