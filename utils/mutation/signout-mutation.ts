import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../axios/axios-interceptor';

export const useSignoutMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async () => {
			const response = await axiosInstance("/api/auth/signout", {
				method: "POST"
			});
			return response.data;
		},
		onSuccess: () => {
			queryClient.setQueryData(["profile"], () => null)
		}
	})
}