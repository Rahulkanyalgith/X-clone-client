"use client";

import { FaXTwitter } from "react-icons/fa6";
import { BiHomeAlt } from "react-icons/bi";
import { FaSearch } from "react-icons/fa";
import { FaRegBell } from "react-icons/fa";
import { FaRegEnvelope } from "react-icons/fa";
import { FaBookmark } from "react-icons/fa";
import { BiUser } from "react-icons/bi";
import { CiCircleMore } from "react-icons/ci";
import { TiGroup } from "react-icons/ti";

import FeedCard from "@/components/FeedCard/page";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useCallback } from "react";
import toast from "react-hot-toast";
import { verifyUserGoogleTokenQuery } from "@/graphql/query/user";
import { grapghqlClient } from "@/clients/api";

interface XtwitterSidebarButton {
  title: string;
  icon: React.ReactNode;
}

const sidebarMenuItems: XtwitterSidebarButton[] = [
  {
    title: "Home",
    icon: <BiHomeAlt />,
  },
  {
    title: "Explore",
    icon: <FaSearch />,
  },
  {
    title: "Notification",
    icon: <FaRegBell />,
  },
  {
    title: "Messages",
    icon: <FaRegEnvelope />,
  },
  {
    title: "Bookmarks",
    icon: <FaBookmark />,
  },
  {
    title: "Communities",
    icon: <TiGroup />,
  },
  {
    title: "Profile",
    icon: <BiUser />,
  },
  {
    title: "More",
    icon: <CiCircleMore />,
  },
];

export default function Home() {
  const handleLoginWithGoogle = useCallback(
    async (cred: CredentialResponse) => {
      const googleToken = cred.credential;
      
      if (!googleToken) return toast.error(`google token not found`);
      const { verifyGoogleToken } = await grapghqlClient.request(
        verifyUserGoogleTokenQuery,
        { token: googleToken }
      );

      toast.success("verified success");
      console.log(verifyGoogleToken);

      if (verifyGoogleToken)
        window.localStorage.setItem("__X_token " , verifyGoogleToken )
    },
    []
  );

  return (
    <div>
      <div className="grid grid-cols-12 h-screen w-screen px-56">
        <div className="col-span-3  justify-start pt-8 px-4">
          <div className="text-3xl h-fit hover:bg-gray-600 rounded-full p-2 cursor-pointer transition-all w-fit">
            <FaXTwitter />
          </div>
          <div className="mt-2 text-2xl font-semibold pr-4">
            <ul>
              {sidebarMenuItems.map((item) => (
                <li
                  className="flex justify-start items-center gap-4 hover:bg-gray-600 rounded-full px-4 w-fit py-2 cursor-pointer mt-2  "
                  key={item.title}
                >
                  <span className="text-3xl">{item.icon}</span>
                  <span>{item.title}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5 px-3">
              <button className="bg-[#1D9BF0] font-semibold text-lg py-2 px-4 rounded-full w-full mt-4 ">
                Post
              </button>
            </div>
          </div>
        </div>
        <div className="col-span-5 border-r-[1px] border-l-[1px] h-screen overflow-scroll border-gray-600">
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
        </div>
        <div className="col-span-3">
          <div className="p-5 bg-slate-700 rounded-lg">
            <h1 className="my-2 text-2xl">New to X?</h1>
            <GoogleLogin onSuccess={handleLoginWithGoogle} />
          </div>
        </div>
      </div>
    </div>
  );
}
