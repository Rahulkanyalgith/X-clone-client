"use client";

import { FaXTwitter } from "react-icons/fa6";
import { BiHomeAlt, BiImageAlt } from "react-icons/bi";
import { FaSearch } from "react-icons/fa";
import { FaRegBell } from "react-icons/fa";
import { FaRegEnvelope } from "react-icons/fa";
import { FaBookmark } from "react-icons/fa";
import { BiUser } from "react-icons/bi";
import { CiCircleMore } from "react-icons/ci";
import { TiGroup } from "react-icons/ti";

import FeedCard from "@/components/FeedCard/page";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { verifyUserGoogleTokenQuery } from "@/graphql/query/user";
import { grapghqlClient } from "@/clients/api";
import { useCurrentUser } from "@/hooks/user";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useCreateTweet, useGetAllTweets } from "@/hooks/post";
import { Tweet } from "@/gql/graphql";
import Twitterlayout from "@/components/FeedCard/Layout/X-Layout";
import { GetServerSideProps } from "next";
import { getAllTweetsQuery } from "@/graphql/query/post";

interface HomeProps {

  tweets?: Tweet[]
}
export default function Home( props : HomeProps) {
  const { user } = useCurrentUser();
  
  const {mutate} = useCreateTweet()

  const queryClient = useQueryClient();

  const [content, setContent] = useState("")

  const handleSelectImage = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("type", "image*");

    input.click();
  }, []);


  const handleCreateTweet = useCallback(
    () => {
      
    },
    [second],
  )
  

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

      if (verifyGoogleToken) {
        window.localStorage.setItem("__X_token ", verifyGoogleToken);
      }

      await queryClient.invalidateQueries({ queryKey: ["current-user"] });
    },
    [queryClient]
  );

  return (
    <div>
    <Twitterlayout>
    <div>
          <div className="border border-r-0 border-l-0 border-b-0 border-gray-600 p-5 hover:bg-slate-900 transition-all cursor-pointer">
            <div className="grid grid-cols-12 gap-3">
              <div className="col-span-1">
                {user?.profileImageURL && (
                  <Image
                    className="rounded-full"
                    src={user?.profileImageURL}
                    alt="user-image"
                    height={50}
                    width={50}
                  />
                )}
              </div>
              <div className="col-span-11">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-transparent text-xl px-3 border-b border-slate-700"
                  placeholder="What's happening?"
                  rows={3}
                ></textarea>
                {imageURL && (
                  <Image
                    src={imageURL}
                    alt="tweet-image"
                    width={300}
                    height={300}
                  />
                )}
                <div className="mt-2 flex justify-between items-center">
                  <BiImageAlt onClick={handleSelectImage} className="text-xl" />
                  <button
                    onClick={handleCreateTweet}
                    className="bg-[#1d9bf0] font-semibold text-sm py-2 px-4 rounded-full"
                  >
                    Tweet
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {props.tweets?.map((tweet) =>
          tweet ? <FeedCard key={tweet?.id} data={tweet as Tweet} /> : null
        )}

    </Twitterlayout>
    </div>
  );
}


export const getServerSideProps: GetServerSideProps<HomeProps> = async (
  context
) => {
  const allTweets = await grapghqlClient.request(getAllTweetsQuery);
  return {
    props: {
      tweets: allTweets.getAllTweets as Tweet[],
    },
  };
};