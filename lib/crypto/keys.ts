export async function generateKeyPair() {
    return await crypto.subtle.generateKey(
        {
            name: "RSA-OAEP",
            modulusLength: 2048,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: "SHA-256",
        },
        true,
        ["encrypt", "decrypt"]
    );
}

function arrayBufferToBase64(buffer: ArrayBuffer) {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;

    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }

    return window.btoa(binary);
}

function base64ToArrayBuffer(base64: string) {
    const binaryString = window.atob(base64);
    const len = binaryString.length;

    const bytes = new Uint8Array(len);

    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }

    return bytes.buffer;
}

export async function savePrivateKey(key: CryptoKey) {
    const exported = await crypto.subtle.exportKey("pkcs8", key);
    localStorage.setItem("privateKey", arrayBufferToBase64(exported));
}

export async function savePublicKey(key: CryptoKey) {
    const exported = await crypto.subtle.exportKey("spki", key);
    return arrayBufferToBase64(exported);
}

// ------- ШИФРОВАНИЕ СООБЩЕНИЯ

export async function generateAESKey() {
    return await crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, [
        "encrypt",
        "decrypt",
    ]);
}

export async function encryptMessage(text: string, aesKey: CryptoKey) {
    const iv = crypto.getRandomValues(new Uint8Array(12));

    const encrypted = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        aesKey,
        new TextEncoder().encode(text)
    );

    return {
        encryptedText: arrayBufferToBase64(encrypted),
        iv: arrayBufferToBase64(iv),
    };
}

export async function encryptAESKey(aesKey: CryptoKey, publicKey: CryptoKey) {
    const rawKey = await crypto.subtle.exportKey("raw", aesKey);

    return await crypto.subtle.encrypt({ name: "RSA-OAEP" }, publicKey, rawKey);
}

export async function decryptAESKeyFromBase64(encryptedKeyBase64: string, privateKey: CryptoKey) {
    const encryptedKeyBuffer = base64ToArrayBuffer(encryptedKeyBase64);

    const rawKey = await crypto.subtle.decrypt(
        { name: "RSA-OAEP" },
        privateKey,
        encryptedKeyBuffer
    );

    return await crypto.subtle.importKey(
        "raw",
        rawKey,
        { name: "AES-GCM", length: 256 }, // Важливо вказати об'єкт параметрів
        true,
        ["decrypt", "encrypt"]
    );
}

export async function decryptMessage(
    encryptedTextBase64: string,
    ivBase64: string,
    aesKey: CryptoKey
) {
    const encryptedData = base64ToArrayBuffer(encryptedTextBase64);
    const iv = new Uint8Array(base64ToArrayBuffer(ivBase64));

    try {
        const decrypted = await crypto.subtle.decrypt(
            { name: "AES-GCM", iv },
            aesKey,
            encryptedData
        );
        return new TextDecoder().decode(decrypted);
    } catch (e) {
        console.error("AES Decrypt Error:", e);
        throw e;
    }
}

export async function importPublicKey(base64: string) {
    const binary = base64ToArrayBuffer(base64);
    return await crypto.subtle.importKey(
        "spki",
        binary,
        {
            name: "RSA-OAEP",
            hash: "SHA-256",
        },
        true,
        ["encrypt"]
    );
}

export async function importPrivateKey(base64: string) {
    const binary = base64ToArrayBuffer(base64);
    return await crypto.subtle.importKey(
        "pkcs8",
        binary,
        {
            name: "RSA-OAEP",
            hash: "SHA-256",
        },
        true,
        ["decrypt"]
    );
}

export async function encryptForAllMembers(
    aesKey: CryptoKey,
    members: { userId: string; publicKey: string }[]
) {
    const encryptedKeys: Record<string, string> = {};

    for (const member of members) {
        const publicKey = await importPublicKey(member.publicKey);

        const encrypted = await encryptAESKey(aesKey, publicKey);

        encryptedKeys[member.userId] = arrayBufferToBase64(encrypted);
    }

    return encryptedKeys;
}
