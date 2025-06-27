import Image from "next/image";
import { useRouter } from "next/router";
import ConnectedWorld from "../../public/ConnectedWorld.svg";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400"],
});

export default function Home() {
  const routeTo = useRouter();
  return (
    <div className={`container px-6  mx-auto ${poppins.className}`}>
      <div className="flex justify-center gap-40 items-center h-screen px-10">
        <div className="w-[50vw] flex flex-col items-center ">
          <div className="flex flex-col gap-4">
            <p className="text-5xl ">
              Connect with friends without Exaggeration
            </p>
            <p className="text-3xl">
              A true Social Media platform, with no blufs !
            </p>
            <div onClick={() => routeTo.push("/login")}>
              <p>Join now</p>
            </div>
          </div>
        </div>

        <div className="w-[50vw] flex ">
          <Image
            src={ConnectedWorld}
            alt="Connected World"
            className="connected-world-image"
          />
        </div>
      </div>
    </div>
  );
}
