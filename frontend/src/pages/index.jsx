import Image from "next/image";
import { useRouter } from "next/router";
import ConnectedWorld from "../../public/ConnectedWorld.svg";
import { Poppins } from "next/font/google";
import UserLayout from "@/layout/UserLayout";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400"],
});

export default function Home() {
  const router = useRouter();
  return (
    <UserLayout>
      <main
        className={`container mx-auto px-4 sm:px-24 py-12 h-[90vh] flex items-center justify-center ${poppins.className}`}
      >
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between w-full gap-10 lg:gap-20">
          {/* Left - Text Section */}
          <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold mb-4 bg-gradient-to-r from-blue-800 to-blue-400 text-transparent bg-clip-text leading-tight">
              Connect with friends without Exaggeration
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-700 mb-8">
              A true Social Media platform, with no blufs!
            </p>
            <button
              onClick={() => router.push("/login")}
              className="bg-blue-800 cursor-pointer hover:bg-blue-950 text-white rounded-md px-6 py-3 font-medium text-base transition-all shadow-md hover:shadow-lg focus-visible:ring-2 focus-visible:ring-indigo-600 focus:outline-none"
            >
              Join now
            </button>
          </div>

          {/* Right - Image Section */}
          <div className="w-full lg:w-1/2 flex justify-center items-center mb-8 lg:mb-0">
            <div className="w-60 sm:w-80 md:w-96 lg:w-full max-w-xs md:max-w-md lg:max-w-lg">
              <Image
                src={ConnectedWorld}
                alt="Connected World"
                priority
                style={{ width: "100%", height: "auto" }}
              />
            </div>
          </div>
        </div>
      </main>
    </UserLayout>
  );
}
