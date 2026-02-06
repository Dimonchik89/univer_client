import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../axios/axios-interceptor";

export const useUpdateLastReadMessageMutation = () => {
    return useMutation({
        mutationKey: [],
        mutationFn: async ({
            activeChatId,
            lastMessageId,
        }: {
            activeChatId: string;
            lastMessageId: string;
        }) => {
            axiosInstance.post(`/api/chats/${activeChatId}/read`, {
                lastMessageId: lastMessageId,
            });
        },
    });
};
