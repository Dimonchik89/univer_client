import { useIsFetching, useQueryClient } from '@tanstack/react-query';
import { UserProfile } from '../../types/user';

export function useProfileFromCache() {
	const queryClient = useQueryClient();
	const isFetchingCount = useIsFetching({ queryKey: ["profile"] }); // добавил для того чтоб при срабатывании queryClient.invalidateQueries({ queryKey: ["profile"] }) страницы где используется кеш тоже обновлялись, без этой строки не будут
	return queryClient.getQueryData<UserProfile>(["profile"])
}