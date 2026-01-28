import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../axios/axios-interceptor";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import axios, { AxiosError } from "axios";
import { generateKeyPair, savePrivateKey, savePublicKey } from "../../lib/crypto/keys";

export const useRegisterMutation = () => {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: async (values: { email: string; password: string }) => {
            const keys = await generateKeyPair();
            await savePrivateKey(keys.privateKey);
            const publicKey = await savePublicKey(keys.publicKey); // отправить на сервер в теле

            const response = await axios({
                method: "POST",
                url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/register`,
                data: {
                    ...values,
                    publicKey,
                },
                // додав для тестування ngrok
                headers: {
                    "ngrok-skip-browser-warning": "true",
                },
            });
            return response.data;
        },
        mutationKey: ["profile"],
        onSuccess: () => {
            // router.push("profile");
            window.location.href = "/";
            queryClient.invalidateQueries({
                queryKey: ["profile"],
            });
        },
        onError: (error) => {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message);
            } else {
                toast.error("Щось пiшло не так. Спробуйте пiзнiше");
            }
        },
    });
};
