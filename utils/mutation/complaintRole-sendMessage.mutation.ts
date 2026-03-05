import { useMutation } from "@tanstack/react-query";
import { InitialValueAnonymousMessage } from "../../types/types";
import axiosInstance from "../axios/axios-interceptor";
import { toast } from "react-toastify";

export const complaintRoleSendMessageMutation = () => {
    return useMutation({
        mutationFn: async (values: InitialValueAnonymousMessage) => {
            const { data } = await axiosInstance.post("/api/complaint-role/send-message", values);
            return data;
        },
        onSuccess: (data) => {
            toast.success(data.message);
        },
        onError: (error) => {
            toast.error(`Щось пiшло не так. Спробуйте пiзнiше. ${error.message}`);
        },
    });
};
