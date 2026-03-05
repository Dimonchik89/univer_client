import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../axios/axios-interceptor";

export const scheduleGroupQuery = ({ currentGroup }: { currentGroup: string }) => {
    return useQuery({
        queryKey: [currentGroup, "schedule"],
        queryFn: async () => {
            const { data } = await axiosInstance.get(`/api/schedule/${currentGroup}`);
            return data;
        },
        staleTime: 1000 * 60 * 15,
        enabled: !!currentGroup,
    });
};
