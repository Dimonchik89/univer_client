// "use client";

// import { useEffect, useLayoutEffect, useRef, useState } from "react";
// import { ChatList } from "./ChatList";
// import { ChatMember, Message } from "../../types/chat";
// import { Socket } from "socket.io-client";
// import axiosInstance from "../../utils/axios/axios-interceptor";
// import { connectSocket } from "../../utils/api/socket";
// import { MessageInput } from "./MessageInput";
// import { DecodeToken } from "../../types/user";
// import {
//     decryptAESKey,
//     decryptMessage,
//     encryptForAllMembers,
//     encryptMessage,
//     generateAESKey,
//     generateKeyPair,
//     savePrivateKey,
// } from "../../lib/crypto/keys";
// import { useQuery } from "@tanstack/react-query";
// import axios from "axios";
// import { useChatUsersQuery } from "../../utils/query/chat-users-query";

// interface ChatLayoutProps {
//     decodeToken: DecodeToken;
// }

// const ChatLayout = ({ decodeToken }: ChatLayoutProps) => {
//     const [chats, setChats] = useState<ChatMember[]>([]);
//     const [activeChat, setActiveChat] = useState<string | null>(null);
//     const [messages, setMessages] = useState<Message[]>([]);

//     const [lastReadAt, setLastReadAt] = useState<string | null>(null);
//     const scrollRef = useRef<HTMLDivElement>(null);

//     const socketRef = useRef<Socket | null>(null);

//     const didInitialScroll = useRef(false);

//     const isScrollDownload = useRef(false);

//     const isFetching = useRef(false);
//     const hasMoreBefore = useRef(true);
//     const hasMoreAfter = useRef(false);

//     const sessionEntryTime = useRef<Date>(new Date());
//     const activeChatRef = useRef<string | null>(null);

//     // ----------------------------- Переделать на useQuery
//     const { data: members } = useChatUsersQuery(activeChat);

//     // -----------------------------

//     useEffect(() => {
//         activeChatRef.current = activeChat;
//     }, [activeChat]);

//     const [scrollHeightBeforeUpdate, setScrollHeightBeforeUpdate] = useState<number>(0);

//     useEffect(() => {
//         axiosInstance.get("/api/chats").then((res) => setChats(res.data));
//         const initSocket = async () => {
//             const { data } = await axiosInstance.get("/api/chats/socket-token");
//             const socket = connectSocket(data.token);

//             socket.on("connect", () => {
//                 console.log("✅ Сокет підключено, ID:", socket.id);
//                 // Якщо чат вже був обраний до моменту конекту - приєднуємось зараз
//                 if (activeChat) {
//                     socket.emit("join_chat", activeChat);
//                 }
//             });

//             socket.on("new_message", (msg: Message) => {
//                 console.log("new_message", msg);
//                 const currentChatId = activeChatRef.current;

//                 setMessages((prev) => [...prev, msg]);
//                 const container = scrollRef.current;

//                 if (container && isScrolledToBottom(container)) {
//                     // console.log("currentChatId", currentChatId);

//                     setLastReadAt(msg.createdAt);
//                     // axiosInstance.post(`/api/chats/${activeChat}/read`, {
//                     //     lastMessageId: msg.id,
//                     // });
//                     axiosInstance.post(`/api/chats/${currentChatId}/read`, {
//                         lastMessageId: msg.id,
//                     });
//                 }
//             });
//             socketRef.current = socket;
//         };

//         initSocket();

//         return () => {
//             if (socketRef.current) socketRef.current.disconnect();
//         };
//     }, []);

//     useEffect(() => {
//         if (!activeChat || !socketRef.current) return;

//         sessionEntryTime.current = new Date();

//         const loadChatData = async () => {
//             try {
//                 isFetching.current = true;

//                 const res = await axiosInstance.get(`/api/chats/${activeChat}/messages`);

//                 setMessages(res.data.messages);
//                 setLastReadAt(res.data.lastReadAt);
//                 hasMoreAfter.current = res.data.messages.length >= 15; // смнеить на число сообщений возвращаемое сервером в сервисах getMessages и oldMessages
//                 hasMoreBefore.current = true;
//                 // Після завантаження повідомлень — позначаємо як прочитане
//                 // axiosInstance.post(`/api/chats/${activeChat}/read`);
//             } catch (error) {
//                 console.log(error);
//             } finally {
//                 isFetching.current = false;
//             }
//         };

//         loadChatData();

//         socketRef.current.emit("join_chat", activeChat);
//     }, [activeChat]);

//     // // Логіка автоматичного скролу
//     useEffect(() => {
//         //
//         if (isScrollDownload.current) return;
//         //

//         if (messages.length > 0) {
//             if (lastReadAt) {
//                 // Шукаємо перше непрочитане
//                 const firstUnread = messages.find(
//                     (m) => new Date(m.createdAt) > new Date(lastReadAt)
//                 );

//                 if (firstUnread) {
//                     console.log("firstUnread.current", firstUnread);

//                     const element = document.getElementById(
//                         `msg-${firstUnread?.id || messages[0].id}`
//                     );
//                     element?.scrollIntoView({ behavior: "auto", block: "center" });
//                     return;
//                 }
//             }
//             // Якщо все прочитано або немає мітки — скролимо в самий кінець
//             const container = scrollRef.current;
//             if (container) {
//                 container.scrollTop = container.scrollHeight;
//             }
//         }
//     }, [messages]);

//     // Логіка автоматичного скролу
//     useEffect(() => {
//         if (!messages.length || didInitialScroll.current === true) return;
//         //
//         if (isScrollDownload.current) return;
//         //

//         requestAnimationFrame(() => {
//             if (lastReadAt) {
//                 const firstUnread = messages.find(
//                     (m) => new Date(m.createdAt) > new Date(lastReadAt)
//                 );

//                 if (firstUnread) {
//                     const element = document.getElementById(`msg-${firstUnread.id}`);
//                     if (element) {
//                         element.scrollIntoView({
//                             behavior: "auto",
//                             block: "center",
//                         });
//                         didInitialScroll.current = true;
//                         return;
//                     }
//                 }
//             }

//             // если lastReadAt нет — скроллим в самый низ
//             scrollRef.current!.scrollTop = scrollRef.current!.scrollHeight;
//             didInitialScroll.current = true;
//         });
//     }, [messages, lastReadAt]);

//     useEffect(() => {
//         didInitialScroll.current = false;
//     }, [activeChat]);

//     useEffect(() => {
//         const container = scrollRef.current;
//         if (!container || !activeChat) return;

//         const onScroll = () => {
//             if (!isScrolledToBottom(container)) return;
//             if (!messages.length) return;

//             const lastMessage = messages[messages.length - 1];

//             axiosInstance.post(`/api/chats/${activeChat}/read`, {
//                 lastMessageId: lastMessage.id,
//             });

//             // если закоментировать то полоса будет взегда над введенными сообщениями
//             setLastReadAt(lastMessage.createdAt);
//         };
//         container.addEventListener("scroll", onScroll);

//         return () => {
//             container.removeEventListener("scroll", onScroll);
//         };
//     }, [messages, activeChat]);

//     function isScrolledToBottom(el: HTMLDivElement) {
//         const threshold = 40;
//         return el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
//     }

//     const handleScroll = async (e: React.UIEvent<HTMLDivElement>) => {
//         const container = e.currentTarget;
//         const { scrollTop, scrollHeight, clientHeight } = container;

//         if (isFetching.current || !activeChat) return;

//         // Скрол вгору — підвантаження історії
//         if (scrollTop === 0 && hasMoreBefore.current && messages.length > 0) {
//             isFetching.current = true;
//             const firstMsgDate = messages[0].createdAt;

//             setScrollHeightBeforeUpdate(container.scrollHeight);

//             isScrollDownload.current = true;

//             try {
//                 const oldMsgs = await axiosInstance.get(
//                     `/api/chats/${activeChat}/messages?cursor=${firstMsgDate}&direction=before`
//                 );

//                 if (oldMsgs.data.messages.length > 0) {
//                     // Зберігаємо висоту до оновлення, щоб скрол не "стрибав"

//                     const prevHeight = container.scrollHeight;
//                     setMessages((prev) => [...oldMsgs.data.messages, ...prev]);

//                     // Коригуємо скрол після додавання елементів вгору
//                     setTimeout(() => {
//                         container.scrollTop = container.scrollHeight - prevHeight;
//                     }, 0);
//                 } else {
//                     hasMoreBefore.current = false;
//                     isScrollDownload.current = false;
//                 }
//             } finally {
//                 isFetching.current = false;
//             }
//         }

//         const isAtBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 50;

//         if (isAtBottom && hasMoreAfter.current && !isFetching.current) {
//             // isFetching.current = false;
//             isFetching.current = true;
//             const lastMessageIndex = messages.length - 1;
//             const lastMsgDate = messages[lastMessageIndex].createdAt;

//             try {
//                 const res = await axiosInstance.get(
//                     `/api/chats/${activeChat}/messages?cursor=${lastMsgDate}&direction=after`
//                 );

//                 const newMsgs = res.data.messages;
//                 if (newMsgs.length > 0) {
//                     const lastMessage = messages[messages.length - 1];
//                     setLastReadAt(lastMessage.createdAt);

//                     isScrollDownload.current = false;
//                     setMessages((prev) => [...prev, ...newMsgs]);
//                 } else {
//                     hasMoreAfter.current = false;
//                 }
//             } finally {
//                 isFetching.current = false;
//             }
//         }
//     };

//     useLayoutEffect(() => {
//         if (isScrollDownload.current && scrollRef.current && scrollHeightBeforeUpdate > 0) {
//             const container = scrollRef.current;
//             // Нова висота мінус стара висота = на скільки пікселів додався контент зверху
//             const heightDifference = container.scrollHeight - scrollHeightBeforeUpdate;

//             container.scrollTop = heightDifference;

//             // Скидаємо прапори
//             // isScrollDownload.current = false;
//             setScrollHeightBeforeUpdate(0);
//         }
//     }, [messages]);

//     return (
//         <div className="flex h-[300px]">
//             <ChatList
//                 chats={chats}
//                 activeChatId={activeChat ?? undefined}
//                 onSelect={setActiveChat}
//             />

//             {activeChat && (
//                 <div className="flex flex-col flex-1">
//                     {/* <ChatWindow messages={messages} /> */}
//                     <div
//                         className="chat-window h-[500px] overflow-y-auto"
//                         ref={scrollRef}
//                         onScroll={handleScroll}
//                     >
//                         {messages.map((msg, index) => {
//                             const isFirstUnread =
//                                 // изменить на количество сообщений какие приходят первый раз из сервера
//                                 messages.length === 30 &&
//                                 lastReadAt &&
//                                 new Date(msg.createdAt) > new Date(lastReadAt) &&
//                                 msg.sender.id !== decodeToken?.id &&
//                                 new Date(msg.createdAt) < sessionEntryTime.current &&
//                                 (index === 0 ||
//                                     new Date(messages[index - 1].createdAt) <=
//                                         new Date(lastReadAt));

//                             console.log("decodeToken?.id!", decodeToken?.id!);
//                             console.log("msg.encryptedKeys", msg.encryptedKeys);

//                             const myEncryptedAESKeyBase64 = msg.encryptedKeys[decodeToken?.id!];

//                             console.log("myEncryptedAESKeyBase64", myEncryptedAESKeyBase64);

//                             const decryptedMessage = decryptMessage(
//                                 msg.encryptedText,
//                                 msg.iv,
//                                 myEncryptedAESKeyBase64 as CryptoKey
//                             );

//                             return (
//                                 <div key={msg.id} id={`msg-${msg.id}`}>
//                                     {isFirstUnread && (
//                                         <div className="bg-blue-100 text-blue-600 text-center py-1 my-2 rounded">
//                                             Нові повідомлення
//                                         </div>
//                                     )}
//                                     <div
//                                         className={`message-item flex gap-1
//                                     ${msg.sender.id === decodeToken?.id ? "justify-self-end" : "justify-self-auto"}`}
//                                     >
//                                         <b>{msg.sender.firstName || msg.sender.email}:</b>{" "}
//                                         {/* {decryptedMessage} */}
//                                     </div>
//                                 </div>
//                             );
//                         })}
//                     </div>
//                     <MessageInput
//                         onSend={async (text) => {
//                             isScrollDownload.current = false;
//                             const aesKey = await generateAESKey();
//                             const encrypted = await encryptMessage(text, aesKey);

//                             if (!members) {
//                                 return;
//                             }

//                             const payload = {
//                                 chatId: activeChat,
//                                 ...encrypted,
//                                 encryptedKeys: await encryptForAllMembers(aesKey, members),
//                             };

//                             console.log("payload", payload);

//                             socketRef.current?.emit("send_message", payload);

//                             // Payload на сервер
//                             // {
//                             //     chatId,
//                             //     encryptedText,
//                             //     iv,
//                             //     encryptedKeys: {
//                             //         userId1: "...",
//                             //         userId2: "..."
//                             //     }
//                             // }

//                             // socketRef.current?.emit("send_message", {
//                             //     chatId: activeChat,
//                             //     text,
//                             // });
//                         }}
//                     />
//                 </div>
//             )}
//         </div>
//     );
// };

// export default ChatLayout;

// ----------------------------------------------------------

"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ChatList } from "./ChatList";
import { ChatMember, Message } from "../../types/chat";
import { Socket } from "socket.io-client";
import axiosInstance from "../../utils/axios/axios-interceptor";
import { connectSocket } from "../../utils/api/socket";
import { MessageInput } from "./MessageInput";
import { DecodeToken } from "../../types/user";
import {
    decryptAESKeyFromBase64,
    decryptMessage,
    encryptForAllMembers,
    encryptMessage,
    generateAESKey,
    importPrivateKey,
} from "../../lib/crypto/keys";
import { useChatUsersQuery } from "../../utils/query/chat-users-query";

// Допоміжний компонент для дешифрування тексту в реальному часі
const DecryptedText = ({
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

interface ChatLayoutProps {
    decodeToken: DecodeToken;
}

const ChatLayout = ({ decodeToken }: ChatLayoutProps) => {
    const [chats, setChats] = useState<ChatMember[]>([]);
    const [activeChat, setActiveChat] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [lastReadAt, setLastReadAt] = useState<string | null>(null);
    const [myPrivateKey, setMyPrivateKey] = useState<CryptoKey | null>(null);

    const scrollRef = useRef<HTMLDivElement>(null);
    const socketRef = useRef<Socket | null>(null);
    const isScrollDownload = useRef(false);
    const isFetching = useRef(false);
    const hasMoreBefore = useRef(true);
    const hasMoreAfter = useRef(false);
    const sessionEntryTime = useRef<Date>(new Date());
    const activeChatRef = useRef<string | null>(null);
    const [scrollHeightBeforeUpdate, setScrollHeightBeforeUpdate] = useState<number>(0);

    const { data: members } = useChatUsersQuery(activeChat);

    useEffect(() => {
        activeChatRef.current = activeChat;
    }, [activeChat]);

    useEffect(() => {
        const loadKey = async () => {
            const storedKey = localStorage.getItem("privateKey");
            if (storedKey) {
                const imported = await importPrivateKey(storedKey);

                setMyPrivateKey(imported);
            } else {
                console.warn("Приватний ключ не знайдено! Шифровані повідомлення недоступні.");
            }
        };
        loadKey();
    }, []);

    useEffect(() => {
        axiosInstance.get("/api/chats").then((res) => setChats(res.data));

        const initSocket = async () => {
            const { data } = await axiosInstance.get("/api/chats/socket-token");
            const socket = connectSocket(data.token);

            socket.on("connect", () => {
                if (activeChat) socket.emit("join_chat", activeChat);
            });

            socket.on("new_message", (msg: Message) => {
                setMessages((prev) => [...prev, msg]);
                const container = scrollRef.current;
                if (container && isScrolledToBottom(container)) {
                    setLastReadAt(msg.createdAt);
                    axiosInstance.post(`/api/chats/${activeChatRef.current}/read`, {
                        lastMessageId: msg.id,
                    });
                }
            });
            socketRef.current = socket;
        };

        initSocket();
        return () => {
            socketRef.current?.disconnect();
        };
    }, []);

    useEffect(() => {
        if (!activeChat || !socketRef.current) return;
        sessionEntryTime.current = new Date();

        const loadChatData = async () => {
            try {
                isFetching.current = true;
                const res = await axiosInstance.get(`/api/chats/${activeChat}/messages`);
                setMessages(res.data.messages);
                setLastReadAt(res.data.lastReadAt);
                hasMoreAfter.current = res.data.messages.length >= 15;
                hasMoreBefore.current = true;
            } finally {
                isFetching.current = false;
            }
        };

        loadChatData();
        socketRef.current.emit("join_chat", activeChat);
    }, [activeChat]);

    // Логіка автоматичного скролу
    useEffect(() => {
        if (isScrollDownload.current || messages.length === 0) return;

        const container = scrollRef.current;
        if (!container) return;

        if (lastReadAt) {
            const firstUnread = messages.find((m) => new Date(m.createdAt) > new Date(lastReadAt));
            if (firstUnread) {
                document
                    .getElementById(`msg-${firstUnread.id}`)
                    ?.scrollIntoView({ behavior: "auto", block: "center" });
                return;
            }
        }
        container.scrollTop = container.scrollHeight;
    }, [messages]);

    useEffect(() => {
        const container = scrollRef.current;
        if (!container || !activeChat) return;

        const onScroll = () => {
            if (!isScrolledToBottom(container) || !messages.length) return;
            const lastMessage = messages[messages.length - 1];
            axiosInstance.post(`/api/chats/${activeChat}/read`, { lastMessageId: lastMessage.id });
            setLastReadAt(lastMessage.createdAt);
        };
        container.addEventListener("scroll", onScroll);
        return () => container.removeEventListener("scroll", onScroll);
    }, [messages, activeChat]);

    function isScrolledToBottom(el: HTMLDivElement) {
        return el.scrollHeight - el.scrollTop - el.clientHeight < 40;
    }

    const handleScroll = async (e: React.UIEvent<HTMLDivElement>) => {
        const container = e.currentTarget;
        if (isFetching.current || !activeChat) return;

        if (container.scrollTop === 0 && hasMoreBefore.current && messages.length > 0) {
            isFetching.current = true;
            const firstMsgDate = messages[0].createdAt;
            setScrollHeightBeforeUpdate(container.scrollHeight);
            isScrollDownload.current = true;

            try {
                const oldMsgs = await axiosInstance.get(
                    `/api/chats/${activeChat}/messages?cursor=${firstMsgDate}&direction=before`
                );
                if (oldMsgs.data.messages.length > 0) {
                    const prevHeight = container.scrollHeight;
                    setMessages((prev) => [...oldMsgs.data.messages, ...prev]);
                    setTimeout(() => {
                        container.scrollTop = container.scrollHeight - prevHeight;
                    }, 0);
                } else {
                    hasMoreBefore.current = false;
                    isScrollDownload.current = false;
                }
            } finally {
                isFetching.current = false;
            }
        }
    };

    useLayoutEffect(() => {
        if (isScrollDownload.current && scrollRef.current && scrollHeightBeforeUpdate > 0) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight - scrollHeightBeforeUpdate;
            setScrollHeightBeforeUpdate(0);
        }
    }, [messages]);

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50">
            <ChatList
                chats={chats}
                activeChatId={activeChat ?? undefined}
                onSelect={setActiveChat}
            />

            {activeChat && (
                <div className="flex flex-col flex-1 border-l border-gray-200">
                    <div
                        className="chat-window flex-1 overflow-y-auto p-4"
                        ref={scrollRef}
                        onScroll={handleScroll}
                    >
                        {messages.map((msg, index) => {
                            const isFirstUnread =
                                messages.length === 30 &&
                                lastReadAt &&
                                new Date(msg.createdAt) > new Date(lastReadAt) &&
                                msg.sender.id !== decodeToken?.id &&
                                new Date(msg.createdAt) < sessionEntryTime.current &&
                                (index === 0 ||
                                    new Date(messages[index - 1].createdAt) <=
                                        new Date(lastReadAt));

                            return (
                                <div key={msg.id} id={`msg-${msg.id}`} className="mb-4">
                                    {isFirstUnread && (
                                        <div className="bg-blue-50 text-blue-500 text-xs text-center py-1 my-4 rounded uppercase tracking-wider font-semibold">
                                            Нові повідомлення
                                        </div>
                                    )}
                                    <div
                                        className={`flex ${msg.sender.id === decodeToken?.id ? "justify-end" : "justify-start"}`}
                                    >
                                        <div
                                            className={`max-w-[70%] p-3 rounded-2xl shadow-sm ${
                                                msg.sender.id === decodeToken?.id
                                                    ? "bg-blue-600 text-white rounded-br-none"
                                                    : "bg-white text-gray-800 rounded-bl-none border border-gray-100"
                                            }`}
                                        >
                                            <div className="text-xs opacity-70 mb-1 font-medium">
                                                {msg.sender.firstName || msg.sender.email}
                                            </div>
                                            <div className="text-sm leading-relaxed break-words">
                                                <DecryptedText
                                                    msg={msg}
                                                    myId={decodeToken!.id}
                                                    privateKey={myPrivateKey}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <MessageInput
                        onSend={async (text) => {
                            if (!members) return;
                            isScrollDownload.current = false;

                            // 1. Генеруємо випадковий AES-GCM ключ для цього повідомлення
                            const aesKey = await generateAESKey();

                            // 2. Шифруємо текст повідомлення цим AES ключем
                            const encrypted = await encryptMessage(text, aesKey);

                            // 3. Шифруємо AES-ключ для кожного учасника чату їхніми Public Keys
                            const encryptedKeys = await encryptForAllMembers(aesKey, members);
                            console.log("payload");

                            const payload = {
                                chatId: activeChat,
                                ...encrypted,
                                encryptedKeys,
                            };

                            socketRef.current?.emit("send_message", payload);
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default ChatLayout;
