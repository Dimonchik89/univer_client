import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../axios/axios-interceptor";
import { UpdateUser, UserProfile } from "../../types/user";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

export const useUpdateUserMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ data, id }: { data: UpdateUser; id: string }) => {
            const response = await axiosInstance({
                method: "PATCH",
                url: `/api/user/${id}`,
                data,
            });
            return response.data;
        },
        onSuccess: (data) => {
            queryClient.setQueryData(["profile"], (oldData: UserProfile) => {
                console.log("oldData", oldData);
                console.log("data", data);

                return { ...oldData, ...data };
            });
            // queryClient.invalidateQueries({ queryKey: ["profile"] })

            toast.success("Дані профілю змінено. Сторінка оновиться автоматично");
        },
        onError: (error) => {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message || "Сталася помилка. Спробуйде пiзнiше");
            } else {
                toast.error("Сталася помилка. Спробуйде пiзнiше");
            }
        },
    });
};
