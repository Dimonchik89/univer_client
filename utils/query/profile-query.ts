import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../axios/axios-interceptor';
import { UserProfile } from '../../types/user';

export const useProfileQuery = (decodeToken: { id : string } | null) => {
	return useQuery({
		queryKey: ["profile"],
		queryFn: async () => {
			const response = await axiosInstance.get<UserProfile>(`/api/user/profile/${decodeToken?.id}`);

			return response.data;
		},
		enabled: !!decodeToken,
		retry: false,
		staleTime: Infinity,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false
	})
}