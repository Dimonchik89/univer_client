import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../axios/axios-interceptor";

// interface ChatUser {
//     chat: { id: string };
//     id: string;
//     joinedAt: Date;
//     lastReadAt: Date | null;
//     user: { id: string; publicKey: string };
// }
interface ChatUser {
    publicKey: string;
    userId: string;
}

export const useChatUsersQuery = (activeChat: string | null) => {
    return useQuery({
        queryKey: ["chat-users", activeChat],
        queryFn: async () => {
            const { data } = await axiosInstance.get<ChatUser[]>(
                `/api/chats/${activeChat}/members-with-keys`
            );

            // const allMembers = data.map(({ user }) => ({
            //     userId: user.id,
            //     publicKey: user.publicKey,
            // }));

            return data;
        },
        enabled: !!activeChat,
        refetchInterval: 1000 * 30,
    });
};
