import { grapghqlClient } from "@/clients/api"
import { getCurrentUserQuery } from "@/graphql/query/user"
import { useQuery } from "@tanstack/react-query"



export const useCurrentUser = () => {
    const query = useQuery({
        queryKey: ['current-user'],
        queryFn: () => grapghqlClient.request(getCurrentUserQuery),
    });
    return {...query , user: query.data?.getCurrentUser};
}

