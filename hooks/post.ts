import { grapghqlClient } from "@/clients/api";
import { CreateTweetData } from "@/gql/graphql";
import { createTweetMutation } from "@/graphql/mutation/post";
import { getAllTweetsQuery } from "@/graphql/query/post";
import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";


export const useCreateTweet = () => {
    const queryClient = useQueryClient();``
  
    const mutation = useMutation({
      mutationFn: (payload: CreateTweetData) =>
        grapghqlClient.request(createTweetMutation as any, { payload }),
      onMutate: (payload) => toast.loading("Creating Tweet", { id: "1" }),
      onSuccess: async (payload) => {
        await queryClient.invalidateQueries({ queryKey: ["all-tweets"]});
        toast.success("Created Success", { id: "1" });
      },
    });
  
    return mutation;
  };

export const useGetAllTweets = () => {
  const query = useQuery({
    queryKey: ["all-tweets"],
    queryFn: () => grapghqlClient.request(getAllTweetsQuery as any),
  });
  return { ...query, tweets : query.data?.getAllTweet};
};
