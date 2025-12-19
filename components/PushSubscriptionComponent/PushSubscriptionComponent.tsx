"use client";
import { useState, useEffect } from "react";
import { urlBase64ToUint8Array } from "../../utils";
import NotEnter from "../NotEnter/NotEnter";
import { Subscription } from "../../types/subscription";
import {
    useCreateSubscriptionMutation,
    useUnsubscribeMutation,
} from "../../utils/mutation/subscription-mutattion";
import { BellOff, BellRing } from "lucide-react";

interface PushSubscriptionComponent {
    id: string | null;
}

const PushSubscriptionComponent: React.FC<PushSubscriptionComponent> = ({ id }) => {
    const [isSupported, setIsSupported] = useState(false);
    const [subscription, setSubscription] = useState<PushSubscription | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const { mutate: subscribeMutation, isPending } = useCreateSubscriptionMutation(); // увiмкення toast одразу в хукi

    const {
        mutate: unsubscribeMutate,
        isSuccess: isUnsubscribeSuccess,
        isPending: isUnsubscribePending,
    } = useUnsubscribeMutation(); // увiмкення toast одразу в хукi

    useEffect(() => {
        if ("serviceWorker" in navigator && "PushManager" in window) {
            setIsSupported(true);
            registerServiceWorker();
        }
    }, []);

    async function registerServiceWorker() {
        const registration = await navigator.serviceWorker.register("/sw.js", {
            scope: "/",
            updateViaCache: "none",
        });
        const sub = await registration.pushManager.getSubscription();
        setSubscription(sub);
    }

    async function subscribeToPush() {
        setIsLoading(true);

        const registration = await navigator.serviceWorker.ready;
        const sub = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!),
        });

        setSubscription(sub);
        const serializedSub = JSON.parse(JSON.stringify(sub)) as Subscription;
        await subscribeMutation(serializedSub);
        setIsLoading(false);
    }

    async function unsubscribeFromPush() {
        const data = await subscription?.unsubscribe();

        if (data && subscription?.endpoint) {
            await unsubscribeMutate(subscription);
        }
    }

    useEffect(() => {
        if (isUnsubscribeSuccess) {
            setSubscription(null);
        }
    }, [isUnsubscribeSuccess]);

    if (!id) {
        return <NotEnter />;
    }

    if (!isSupported) {
        return (
            <div className="flex justify-center">
                <p>Push notifications are not supported in this browser.</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-lg mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-md p-6 border border-gray-200 dark:border-gray-700 mt-6">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                {subscription ? (
                    <BellRing className="w-6 h-6 text-green-600" />
                ) : (
                    <BellOff className="w-6 h-6 text-gray-500 dark:text-gray-300" />
                )}
                Push-сповіщення
            </h3>

            {subscription ? (
                <div className="space-y-5">
                    <p className="text-gray-700 dark:text-gray-300 text-lg">
                        Ви підписані на push-сповіщення
                    </p>

                    <button
                        onClick={unsubscribeFromPush}
                        disabled={isUnsubscribePending}
                        className={`button-primary
							${
                                isUnsubscribePending
                                    ? "bg-green-300 cursor-not-allowed"
                                    : "bg-green-600 hover:bg-green-700 active:bg-green-800"
                            }`}
                    >
                        {isUnsubscribePending ? "Завантаження..." : "Відписатися"}
                    </button>
                </div>
            ) : (
                <div className="space-y-5">
                    <p className="text-gray-700 dark:text-gray-300 text-lg">
                        Ви не підписані на push-сповіщення
                    </p>

                    <button
                        onClick={subscribeToPush}
                        disabled={isLoading}
                        className={`button-primary
							${
                                isLoading
                                    ? "bg-green-300 cursor-not-allowed"
                                    : "bg-green-600 hover:bg-green-700 active:bg-green-800"
                            }`}
                    >
                        {isLoading ? "Завантаження..." : "Підписатися"}
                    </button>
                </div>
            )}
        </div>
    );
};
export default PushSubscriptionComponent;
