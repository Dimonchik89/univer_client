import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../axios/axios-interceptor";
import { ChatMember } from "../../types/chat";

export const useGetUserChatsQuery = () => {
    return useQuery({
        queryKey: ["chats"],
        queryFn: async () => {
            const { data } = await axiosInstance.get<ChatMember[]>("/api/chats");
            return data;
        },
    });
};

// export const useGetChatMessage = ({
//     activeChat,
//     msgDate,
//     direction,
// }: {
//     activeChat: string | null;
//     msgDate?: Date;
//     direction?: "before" | "after";
// }) => {
//     return useQuery({
//         queryKey: ["messages", activeChat, msgDate, direction],
//         queryFn: async () => {
//             const { data } = await axiosInstance.get(`/api/chats/${activeChat}/messages`, {
//                 params: {
//                     cursor: msgDate,
//                     direction: direction,
//                 },
//             });

//             return data;
//         },
//         enabled: !!activeChat,
//     });
// };
