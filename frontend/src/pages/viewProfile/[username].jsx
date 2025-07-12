import { BASE_URL, clientServer } from "@/config";
import UserLayout from "@/layout/UserLayout";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import DashboardLayout from "@/layout/DashboardLayout";
import { useDispatch, useSelector } from "react-redux";
import { getAllPosts } from "@/config/redux/action/postAction";
import { ScrollArea } from "@/Components/ui/scroll-area";
import {
  getMyConnectionsRequests,
  sendConnectionRequest,
} from "@/config/redux/action/authAction";
import { Button } from "@/Components/ui/button";
import { useRouter } from "next/router";

function viewProfilePage({ userProfile }) {
  // useEffect(() => {
  //   console.log("viewProfilePage");
  // });

  const router = useRouter();
  const [userPosts, setUserPosts] = useState([]);

  const dispatch = useDispatch();

  const searchParams = useSearchParams();

  const postState = useSelector((state) => state.postReducer);

  const authState = useSelector((state) => state.auth);

  const [isCurrentUserInConnection, setIsCurrentUserInConnection] =
    useState(false);

  const getUserPosts = async () => {
    await dispatch(getAllPosts());
    await dispatch(
      getMyConnectionsRequests({ token: localStorage.getItem("token") })
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      await getUserPosts();
    };
    fetchData();
  }, []);

  useEffect(() => {
    let posts = Array.isArray(postState.posts.allPosts)
      ? postState.posts.allPosts.filter((post) => {
          return post.userId.username === router.query.username;
        })
      : [];

    setUserPosts(posts);
  }, [postState.posts.allPosts, router.query.username]);

  useEffect(() => {
    if (
      Array.isArray(authState.connections) &&
      authState.connections.some(
        (user) => user.connectionId._id === userProfile.userId._id
      )
    ) {
      setIsCurrentUserInConnection(true);
    } else {
      setIsCurrentUserInConnection(false);
    }
  }, [authState.connections, userProfile.userId._id]);

  // console.log(isCurrentUserInConnection);
  return (
    <UserLayout>
      <DashboardLayout>
        <div className="h-[100vh] relative p-5 ">
          {" "}
          <div className="">
            <img
              src="https://images.pexels.com/photos/164175/pexels-photo-164175.jpeg"
              alt=""
              className="object-cover h-[27vh] w-full rounded-lg"
            />
            <img
              src={`${BASE_URL}/${userProfile.userId.profilePicture}`}
              alt=""
              className="w-[6em] h-[6em] absolute top-36 left-16 rounded-full bg-black"
            />
          </div>
          <div className="flex pt-10 w-full">
            <div className="w-[70%]">
              {" "}
              <div className="flex gap-4">
                <p className="font-bold ">{userProfile.userId.name}</p>
                <p>@{userProfile.userId.username}</p>
              </div>
              <div>
                {isCurrentUserInConnection ? (
                  <Button>Connected</Button>
                ) : (
                  <Button
                    onClick={async () => {
                      await dispatch(
                        sendConnectionRequest({
                          token: localStorage.getItem("token"),
                          connectionId: userProfile.userId._id,
                        })
                      );
                      // Refetch connections to update state
                      await dispatch(
                        getMyConnectionsRequests({
                          token: localStorage.getItem("token"),
                        })
                      );
                    }}
                  >
                    connect
                  </Button>
                )}
              </div>
              <div>
                <p>{userProfile.bio}</p>
              </div>
            </div>
            <div className="w-[30%] flex flex-col gap-5 ">
              <p className="font-bold">Recent Activity</p>
              <ScrollArea className="h-[70%] w-[100%]  border-1 border-black rounded-md  ">
                <div className="flex flex-col gap-5 pt-3 bg-white">
                  {(userPosts || []).map((post, idx) => (
                    <div
                      key={idx}
                      className="flex gap-2 items-start hover:bg-gray-100 p-2 px-5 cursor-pointer"
                    >
                      <img
                        src={`${BASE_URL}/${post.media}`}
                        alt=""
                        className="w-10 h-10"
                      />
                      <p className="text-sm">{post.body}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
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
