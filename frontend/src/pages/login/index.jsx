import { Button } from "../../Components/ui/button.jsx";
import { loginUser, registerUser } from "@/config/redux/action/authAction";
import { emptyMessage } from "@/config/redux/reducer/authReducer";
import UserLayout from "@/layout/UserLayout";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

function index() {
  const authState = useSelector((state) => state.auth);
  const [UserLoginMethod, setUserLoginMethod] = useState(false);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [tst, setTst] = useState(false);
  const [password, setPassword] = useState("");
  const [checkSignUpFields, setCheckSignUpFields] = useState(false);
  const [checkLoginFields, setCheckLoginFields] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleRegister = async () => {
    try {
      console.log("Registering...");

      await dispatch(
        registerUser({ name, username, email, password })
      ).unwrap();

      setTst(true);
      setUserLoginMethod(true);
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  useEffect(() => {
    {
      // if (tst) {
      toast("User Register Successfully!", {
        action: {
          label: "X",
          onClick: () => console.log("X"),
        },
        style: {
          background: "#BAFFBF", // Indigo
          color: "#006400",
          opacity: "1",
          border: "1px solid rgb(21 128 61)",
        },
      });
      // }
    }
  }, [tst, authState.allUsers]);

  const handleLogin = () => {
    console.log("Logging in...");
    dispatch(
      loginUser({
        email,
        password,
      })
    );
    // setUserLoginMethod(false);
  };

  useEffect(() => {
    setCheckSignUpFields(name && username && email && password);
  }, [name, username, email, password]);

  useEffect(() => {
    setCheckLoginFields(email && password);
  }, [email, password]);

  useEffect(() => {
    dispatch(emptyMessage());
  }, [UserLoginMethod]);

  useEffect(() => {
    if (authState.loggedIn) {
      router.push("/dashboard");
    }
  }, [authState.loggedIn]);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      router.push("/dashboard");
    }
  });
  return (
    <UserLayout>
      <div className="flex justify-center items-center h-[90vh] ">
        <div className=" h-[80vh] w-[80vw] bg-white shadow-xl flex flex-col justify-between md:flex-row md:justify-center items-center">
          <div className="w-[100%] md:w-[60%] flex flex-col items-center">
            <p className="font-semibold text-2xl">
              {" "}
              {UserLoginMethod ? "Sign In" : "Sign Up"}
            </p>

            <p
              className={authState.isError ? `text-red-500` : `text-green-500`}
            >
              {authState.message.message || ""}
            </p>

            <div className="flex flex-col gap-5 mt-10 min-w-[55%] max-w-[100%]">
              {!UserLoginMethod && (
                <div className="flex flex-col lg:flex-row gap-2">
                  <input
                    type="username"
                    placeholder="Username"
                    onChange={(e) => setUsername(e.target.value)}
                    className="border-1 border-gray-500 p-2 rounded-lg"
                  />
                  <input
                    type="name"
                    placeholder="Name"
                    onChange={(e) => setName(e.target.value)}
                    className="border-1 border-gray-500 p-2 rounded-lg"
                  />
                </div>
              )}

              <div className="flex flex-col gap-2">
                <input
                  type="email"
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-1 border-gray-500 p-2 rounded-lg"
                />
              </div>
              <div className="flex flex-col gap-2">
                <input
                  type="password"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-1 border-gray-500 p-2 rounded-lg"
                />
              </div>
              <div className="flex flex-col gap-2">
                <button
                  className={` cursor-pointer p-2 rounded-lg  ${
                    (checkSignUpFields && !UserLoginMethod) ||
                    (checkLoginFields && UserLoginMethod)
                      ? "bg-blue-700 text-white"
                      : "bg-gray-300/60 text-black"
                  } transition-all duration-1000`}
                  onClick={() => {
                    if (UserLoginMethod) {
                      handleLogin();
                    } else {
                      handleRegister();
                    }
                  }}
                >
                  {UserLoginMethod ? "Sign In" : "Sign Up"}
                </button>
              </div>
            </div>
          </div>
          <div className="w-[100%] md:w-[40%] bg-blue-900 flex flex-col gap-3 justify-center items-center h-[15vh] md:h-full">
            <p className="text-white">
              {!UserLoginMethod
                ? "Already have an account?"
                : "Don't have an account?"}
            </p>
            <Button
              variant="secondary"
              className=" cursor-pointer px-8 py-2 rounded-lg"
              onClick={() => setUserLoginMethod(!UserLoginMethod)}
            >
              {!UserLoginMethod ? "Sign In" : "Sign Up"}
            </Button>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}

export default index;
