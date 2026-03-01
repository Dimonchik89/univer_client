"use client";
import { toast } from "react-toastify";
import { generateAndSendKeysForEncryption } from "../../utils/api/send-secret-keys";
import { useRouter } from "next/navigation";

// A page for device registration when logging in through Google mail for generating and saving encryption keys
const RegDevice = () => {
    const router = useRouter();

    generateAndSendKeysForEncryption()
        .then((data) => {
            router.push("/");
        })
        .catch((error) => {
            toast.error("При реєстрації виникла помилка, спробуйте пізніше");
            setTimeout(() => {
                router.push("/");
            }, 3000);
        });

    return <></>;
};

export default RegDevice;
