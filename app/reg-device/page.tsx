"use client";
import { toast } from "react-toastify";
import { generateAndSendKeysForEncryption } from "../../utils/api/send-secret-keys";
import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useRef } from "react";

// A page for device registration when logging in through Google mail for generating and saving encryption keys
const RegDevice = () => {
    const router = useRouter();
    const hasCalled = useRef(false);

    useEffect(() => {
        if (hasCalled.current) return;
        hasCalled.current = true;

        const register = async () => {
            try {
                const data = await generateAndSendKeysForEncryption();
                router.push("/");
            } catch (error) {
                toast.error("При реєстрації виникла помилка, спробуйте пізніше");
                setTimeout(() => {
                    router.push("/");
                }, 3000);
            }
        };

        register();
    }, [router]);

    return <></>;
};

export default RegDevice;
