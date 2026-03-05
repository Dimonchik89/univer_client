import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../axios/axios-interceptor";
import { ComplaintRoleResponse } from "../../types/complaintRole";

export const complaintRoleQuery = () => {
    return useQuery({
        queryKey: ["complaint-role"],
        queryFn: async () => {
            const { data } = await axiosInstance.get<ComplaintRoleResponse>("/api/complaint-role", {
                params: {
                    limit: 200,
                },
            });
            return data?.results;
        },
        staleTime: 1000 * 60 * 60,
    });
};
