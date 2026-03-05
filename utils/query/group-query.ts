import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../axios/axios-interceptor";

export const groupQuery = () => {
    return useQuery({
        queryKey: ["groups"],
        queryFn: async () => {
            const { data } = await axiosInstance.get("/api/academic-group?limit=200");
            return data;
        },
        staleTime: 1000 * 60 * 60,
    });
};
