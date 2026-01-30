"use client";
import { useEffect, useState } from "react";
import { Message } from "../../types/chat";
import { decryptAESKeyFromBase64, decryptMessage } from "../../lib/crypto/keys";

const ChatDecryptedText = ({
    msg,
    myId,
    privateKey,
}: {
    msg: Message;
    myId: string;
    privateKey: CryptoKey | null;
}) => {
    const [text, setText] = useState<string>("Дешифрування...");

    useEffect(() => {
        async function decode() {
            if (!privateKey || !msg.encryptedKeys?.[myId]) {
                setText("[Помилка доступу: ключ не знайдено]");
                return;
            }

            try {
                const aesKey = await decryptAESKeyFromBase64(msg.encryptedKeys[myId], privateKey);

                const decrypted = await decryptMessage(msg.encryptedText, msg.iv, aesKey);
                setText(decrypted);
            } catch (e) {
                setText("[Помилка дешифрування]");
            }
        }
        decode();
    }, [msg, myId, privateKey]);

    return <span>{text}</span>;
};

export default ChatDecryptedText;
