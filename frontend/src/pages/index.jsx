import Image from "next/image";
import { useRouter } from "next/router";
import ConnectedWorld from "../../public/ConnectedWorld.svg";
import { Poppins } from "next/font/google";
import Navbar from "@/Components/Navbar";
import UserLayout from "@/layout/UserLayout";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400"],
});

export default function Home() {
  const routeTo = useRouter();
  return (
    <UserLayout>
      <div className={`container px-6  mx-auto ${poppins.className}`}>
        <div className="flex justify-center gap-40 items-center h-[80vh] px-10">
          <div className="w-[60vw] flex flex-col items-center ">
            <div className="flex flex-col gap-4 ">
              <p className="text-[2.9rem] font-semibold bg-gradient-to-r from-indigo-950 to-indigo-950/50  inline-block text-transparent bg-clip-text">
                Connect with friends without Exaggeration
              </p>
              <p className="text-3xl text-gray-700">
                A true Social Media platform, with no blufs !
              </p>
              <div
                onClick={() => routeTo.push("/login")}
                className="bg-indigo-900 hover:bg-indigo-950 w-fit h-fit px-5 py-2 cursor-pointer text-white transition-all rounded-sm duration-200"
              >
                <p>Join now</p>
              </div>
            </div>
          </div>

          <div className="w-[40vw] flex ">
            <Image
              src={ConnectedWorld}
              alt="Connected World"
              className="connected-world-image"
            />
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
