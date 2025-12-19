import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import axiosInstance from "../axios/axios-interceptor";
import { UniversityEvent } from "../../types/event";

export const useMonthEvents = (month: string) => {
    return useQuery<Date[]>({
        queryKey: ["event", "month", month],
        queryFn: async () => {
            const response = await axiosInstance("/api/event/by-date", {
                params: {
                    month: month,
                },
            });
            return response.data;
        },
        staleTime: 1000 * 60 * 60,
    });
};

export const useDayEvents = (selectedDay: Date | null | undefined) => {
    return useQuery<UniversityEvent[]>({
        queryKey: ["event", "month", selectedDay],
        queryFn: async () => {
            const response = await axiosInstance("/api/event/by-date", {
                params: {
                    date: selectedDay,
                },
            });
            return response.data;
        },
        enabled: !!selectedDay,
        staleTime: 1000 * 60 * 60,
    });
};
