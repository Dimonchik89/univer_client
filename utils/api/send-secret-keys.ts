import { generateKeyPair, savePrivateKey, savePublicKey } from "../../lib/crypto/keys";
import axiosInstance from "../axios/axios-interceptor";
import { getOrCreateDeviceId } from "../device/deviceId";

async function generateAndSendKeysForEncryption() {
    const keys = await generateKeyPair();
    await savePrivateKey(keys.privateKey);
    const publicKey = await savePublicKey(keys.publicKey);

    const deviceId = getOrCreateDeviceId();
    return await axiosInstance.post("/api/devices", {
        deviceId,
        deviceName: navigator?.userAgent,
        publicKey,
    });
}

export { generateAndSendKeysForEncryption };
