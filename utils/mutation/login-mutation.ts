import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import axios, { AxiosError } from "axios";
import { generateAndSendKeysForEncryption } from "../api/send-secret-keys";

export const useLoginMutation = () => {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: async (values: { email: string; password: string }) => {
            const response = await axios({
                method: "POST",
                url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/login`,
                data: values,
                // додав для тестування ngrok
                headers: {
                    "ngrok-skip-browser-warning": "true",
                },
            });
            return response.data;
        },
        mutationKey: ["profile"],
        onSuccess: async (data) => {
            await generateAndSendKeysForEncryption();

            window.location.href = "/";
            queryClient.invalidateQueries({
                queryKey: ["profile"],
            });
        },
        onError: (error) => {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message || error.response?.data.error);
            } else {
                toast.error("Щось пiшло не так. Спробуйте пiзнiше");
            }
        },
    });
};
