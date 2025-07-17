"use client";

import UserLayout from "@/layout/UserLayout";
import { useEffect } from "react";
import DashboardLayout from "@/layout/DashboardLayout";
import { useDispatch, useSelector } from "react-redux";
import {
  AcceptConnection,
  getMyConnectionsRequests,
} from "@/config/redux/action/authAction";
import { BASE_URL } from "@/config";
import { useRouter } from "next/router";
import { Button } from "@/Components/ui/button";

function MyConnectionsPage() {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    dispatch(
      getMyConnectionsRequests({ token: localStorage.getItem("token") })
    );
  }, [dispatch]);

  const pendingRequests =
    authState.connectionRequest?.filter(
      (cnn) => cnn.status_accepted === null
    ) || [];

  const acceptedConnections =
    authState.connectionRequest?.filter(
      (cnn) => cnn.status_accepted !== null
    ) || [];

  const handleAcceptConnection = (e, connectionId) => {
    e.stopPropagation();
    dispatch(
      AcceptConnection({
        connectionId,
        token: localStorage.getItem("token"),
        action: "accept",
      })
    );
  };

  const handleProfileClick = (username) => {
    router.push(`/viewProfile/${username}`);
  };

  return (
    <UserLayout>
      <DashboardLayout>
        <div className="min-h-screen bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                My Connections
              </h1>
              <p className="mt-2 text-gray-600">
                Manage your connection requests and network
              </p>
            </div>

            {/* Stats Cards */}
            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {pendingRequests.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Connected
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {acceptedConnections.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {authState.connectionRequest?.length || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {/* Pending Requests */}
              <div>
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Pending Requests
                  </h2>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                    {pendingRequests.length}
                  </span>
                </div>

                <div className="space-y-4">
                  {pendingRequests.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                      <div className="w-12 h-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <div className="w-6 h-6 bg-gray-400 rounded-full"></div>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No pending requests
                      </h3>
                      <p className="text-gray-600">
                        All connection requests have been processed
                      </p>
                    </div>
                  ) : (
                    pendingRequests.map((request, idx) => (
                      <div
                        key={idx}
                        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer transition-all hover:shadow-md hover:border-gray-300"
                        onClick={() =>
                          handleProfileClick(request.userId.username)
                        }
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                              <img
                                className="h-12 w-12 rounded-full object-cover border-2 border-gray-200"
                                src={`${BASE_URL}/${request.userId.profilePicture}`}
                                alt={request.userId.name}
                                onError={(e) => {
                                  e.target.src = `https://ui-avatars.com/api/?name=${request.userId.name}&background=f3f4f6&color=374151`;
                                }}
                              />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                {request.userId.name}
                              </h3>
                              <p className="text-sm text-gray-600">
                                @{request.userId.username}
                              </p>
                            </div>
                          </div>
                          <Button
                            onClick={(e) =>
                              handleAcceptConnection(e, request._id)
                            }
                            className="bg-black text-white hover:bg-gray-800 px-4 py-2 rounded-md font-medium transition-colors"
                          >
                            Accept
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* My Network */}
              <div>
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    My Network
                  </h2>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {acceptedConnections.length}
                  </span>
                </div>

                <div className="space-y-4">
                  {acceptedConnections.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                      <div className="w-12 h-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <div className="w-6 h-6 bg-gray-400 rounded-full"></div>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No connections yet
                      </h3>
                      <p className="text-gray-600">
                        Start connecting with people to build your network
                      </p>
                    </div>
                  ) : (
                    acceptedConnections.map((request, idx) => (
                      <div
                        key={idx}
                        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer transition-all hover:shadow-md hover:border-gray-300"
                        onClick={() =>
                          handleProfileClick(request.userId.username)
                        }
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <img
                              className="h-12 w-12 rounded-full object-cover border-2 border-gray-200"
                              src={`${BASE_URL}/${request.userId.profilePicture}`}
                              alt={request.userId.name}
                              onError={(e) => {
                                e.target.src = `https://ui-avatars.com/api/?name=${request.userId.name}&background=f3f4f6&color=374151`;
                              }}
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">
                              {request.userId.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              @{request.userId.username}
                            </p>
                          </div>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                            Connected
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}

export default MyConnectionsPage;
