import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';

export const useResetPasswordMutation = () => {
	const router = useRouter();

	return useMutation({
		mutationFn: async (values: { newPassword: string, token: string }) => {
			const response = await axios({
				url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/reset-password`,
				method: "POST",
				data: values
			})
			return response.data;
		},
		onSuccess: () => {
			router.push("/login");
			toast.success("Пароль успiшно оновлено. Увiйдiть в особистий кабiнет")
		},
		onError: (error) => {
			if(error instanceof AxiosError) {
				toast.error(error.response?.data.message || "Щось пiшло не так. Спробуйте пiзнiше")
			}
		}
	})
}