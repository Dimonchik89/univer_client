import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { InitialValuesForgotPassword } from '../../types/types';

export const useForgotPasswordMutation = () => {
	return useMutation({
		mutationKey: ["forgot"],
		mutationFn: async (data: InitialValuesForgotPassword) => {
			const response = await axios({
				url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/forgot-password`,
				method: "POST",
				data,
				// додав для тестування ngrok
				headers: {
					"ngrok-skip-browser-warning": "true"
				},
			});
			return response.data;
		},
		onSuccess: (data) => {
			toast.success(data.message);
		},
		onError: (error) => {
			if(error instanceof AxiosError) {
				toast.error(error.response?.data.message || error.response?.data.error);
			} else {
				toast.error("Щось пiшло не так. Спробуйте пiзнiше");
			}
		}
	})
}