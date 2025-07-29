import { BASE_URL, clientServer } from "@/config";
import UserLayout from "@/layout/UserLayout";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import DashboardLayout from "@/layout/DashboardLayout";
import { useDispatch, useSelector } from "react-redux";
import { getAllPosts } from "@/config/redux/action/postAction";
import { ScrollArea } from "../../Components/ui/scroll-area";
import {
  getConnectionRequest,
  getMyConnectionsRequests,
  sendConnectionRequest,
} from "@/config/redux/action/authAction";
import { Button } from "../../Components/ui/button";
import { useRouter } from "next/router";
import { store } from "@/config/redux/store";

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

  const [isConnectionNull, setIsConnectionNull] = useState(true);

  const getUserPosts = async () => {
    await dispatch(getAllPosts());
    await dispatch(
      getConnectionRequest({ token: localStorage.getItem("token") })
    );
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
    const matchedConnection =
      (Array.isArray(authState.connections) &&
        authState.connections.find(
          (cn) => cn.connectionId._id === userProfile.userId._id
        )) ||
      (Array.isArray(authState.connectionRequest) &&
        authState.connectionRequest.find(
          (cn) => cn.userId._id === userProfile.userId._id
        ));

    setIsCurrentUserInConnection(!!matchedConnection);
    if (matchedConnection && matchedConnection.status_accepted === true) {
      setIsConnectionNull(false);
    }
  }, [authState.connections, authState.connectionRequest]);

  return (
    <UserLayout>
      <DashboardLayout>
        <ScrollArea className="h-full w-[100%] border-none px-2 py-2 sm:px-6 mb-10">
          <div className="h-[100vh] relative p-5 rounded-xl bg-white ">
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
              <div className="w-[70%] flex flex-col gap-3">
                {" "}
                <div className="flex gap-4">
                  <p className="font-bold ">{userProfile.userId.name}</p>
                  <p>@{userProfile.userId.username}</p>
                </div>
                <div className="flex gap-5 items-center ">
                  {isCurrentUserInConnection ? (
                    <button className="flex border-2 gap-2  justify-center cursor-pointer items-center w-fit py-1 text-black border-black rounded-xl px-3  bg-gray-100">
                      {isConnectionNull ? <>Pending</> : <>Connected</>}
                      {/* <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="size-4"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="m4.5 12.75 6 6 9-13.5"
                      />
                    </svg> */}
                    </button>
                  ) : (
                    <Button
                      onClick={() => {
                        dispatch(
                          sendConnectionRequest({
                            token: localStorage.getItem("token"),
                            connectionId: userProfile.userId._id,
                          })
                        );
                        // Wait for getConnectionRequest to finish
                        dispatch(
                          getConnectionRequest({
                            token: localStorage.getItem("token"),
                          })
                        );
                        // Optionally, force check here if needed
                        // const updatedConnections =
                        //   store.getState().auth.connections;
                        // const matchedConnection =
                        //   Array.isArray(updatedConnections) &&
                        //   updatedConnections.some(
                        //     (connection) =>
                        //       connection._id === userProfile.userId._id
                        //   );
                        // setIsCurrentUserInConnection(matchedConnection);
                      }}
                      className="cursor-pointer"
                    >
                      Connect
                    </Button>
                  )}
                  {/* {console.log("user ki id: ", userProfile._id)} */}
                  <div
                    className="cursor-pointer"
                    onClick={async () => {
                      const response = await clientServer.get(
                        `/user/download_resume?id=${userProfile.userId._id}`
                      );
                      window.open(
                        `${BASE_URL}/${response.data.message}`,
                        "_blank"
                      );
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="size-6"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                      />
                    </svg>
                  </div>
                </div>
                <div>
                  <p>{userProfile.bio}</p>
                </div>
                <div>
                  <p className="font-bold">Work History</p>
                  <div className="flex flex-wrap gap-3">
                    {userProfile.pastWork.map((work) => {
                      return (
                        <div
                          className="bg-white w-fit px-3 py-2 rounded-md"
                          style={{
                            boxShadow: "10px 10px 10px 0px rgb(0,0,0,0.1)",
                          }}
                        >
                          <p>Company Name : {work.company}</p>
                          <p>Position : {work.position}</p>
                          <p>Year of Experience : {work.Year}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="w-[30%] flex flex-col gap-5 ">
                <p className="font-bold">Recent Activity</p>
                <ScrollArea className="h-[40vh] w-[100%]  border-1 bg-white border-black rounded-md  ">
                  <div className="flex flex-col gap-5 pt-3 ">
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
        </ScrollArea>
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
