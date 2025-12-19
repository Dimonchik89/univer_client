import { useMutation } from '@tanstack/react-query'
import axiosInstance from '../axios/axios-interceptor';
import { Subscription } from '../../types/subscription';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

export const useCreateSubscriptionMutation = () => {
	return useMutation({
		mutationFn: async (serializedSub: Subscription) => {
			const { data } = await axiosInstance<{ message: string }>({
				method: "POST",
				url: "/api/subscriptions",
				data: {...serializedSub }
			});
			return data;
		},
		onSuccess: (data) => {
			toast.success(data?.message || 'Пiдписка на повiдомлення оформлена');
		},
		onError: (error) => {
			if(error instanceof AxiosError) {
				toast.error(error.response?.data.message || "Сталася помилка");
			} else {
				toast.error("Сталася помилка");
			}
		}
	})
}

export const useUnsubscribeMutation = () => {
	return useMutation({
		mutationFn: async (subscription: PushSubscription) => {
			const { data } = await axiosInstance({
					method: "DELETE",
					url: `api/subscriptions`,
					data: { endpoint: subscription?.endpoint },
				});
			return data;
		},
		onSuccess: () => {
			toast.success("Ви вiдмiнили пiдписку");
		},
		onError: (error) => {
			if(error instanceof AxiosError) {
				toast.error(error.response?.data.message || "Сталася помилка");
			} else {
				toast.error("Сталася помилка");
			}
		}
	})
}