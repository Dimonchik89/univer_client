"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ChatList } from "./ChatList";
import { ChatMember, Message } from "../../types/chat";
import { Socket } from "socket.io-client";
import axiosInstance from "../../utils/axios/axios-interceptor";
import { connectSocket } from "../../utils/api/socket";
import { MessageInput } from "./MessageInput";
import { DecodeToken } from "../../types/user";

interface ChatLayoutProps {
    decodeToken: DecodeToken;
}

const ChatLayout = ({ decodeToken }: ChatLayoutProps) => {
    const [chats, setChats] = useState<ChatMember[]>([]);
    const [activeChat, setActiveChat] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);

    const [lastReadAt, setLastReadAt] = useState<string | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    const socketRef = useRef<Socket | null>(null);

    const didInitialScroll = useRef(false);

    const isScrollDownload = useRef(false);

    const isFetching = useRef(false);
    const hasMoreBefore = useRef(true);
    const hasMoreAfter = useRef(false);

    const sessionEntryTime = useRef<Date>(new Date());
    const activeChatRef = useRef<string | null>(null);
    useEffect(() => {
        activeChatRef.current = activeChat;
    }, [activeChat]);

    const [scrollHeightBeforeUpdate, setScrollHeightBeforeUpdate] = useState<number>(0);

    useEffect(() => {
        axiosInstance.get("/api/chats").then((res) => setChats(res.data));
        const initSocket = async () => {
            const { data } = await axiosInstance.get("/api/chats/socket-token");
            const socket = connectSocket(data.token);

            socket.on("connect", () => {
                console.log("✅ Сокет підключено, ID:", socket.id);
                // Якщо чат вже був обраний до моменту конекту - приєднуємось зараз
                if (activeChat) {
                    socket.emit("join_chat", activeChat);
                }
            });

            socket.on("new_message", (msg: Message) => {
                console.log("new_message", msg);
                const currentChatId = activeChatRef.current;

                setMessages((prev) => [...prev, msg]);
                const container = scrollRef.current;

                if (container && isScrolledToBottom(container)) {
                    console.log("currentChatId", currentChatId);

                    setLastReadAt(msg.createdAt);
                    axiosInstance.post(`/api/chats/${currentChatId}/read`, {
                        lastMessageId: msg.id,
                    });
                }
            });
            socketRef.current = socket;
        };

        initSocket();

        return () => {
            if (socketRef.current) socketRef.current.disconnect();
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
                hasMoreAfter.current = res.data.messages.length >= 15; // смнеить на число сообщений возвращаемое сервером в сервисах getMessages и oldMessages
                hasMoreBefore.current = true;
                // Після завантаження повідомлень — позначаємо як прочитане
                // axiosInstance.post(`/api/chats/${activeChat}/read`);
            } catch (error) {
                console.log(error);
            } finally {
                isFetching.current = false;
            }
        };

        loadChatData();

        socketRef.current.emit("join_chat", activeChat);
    }, [activeChat]);

    // // Логіка автоматичного скролу
    useEffect(() => {
        //
        if (isScrollDownload.current) return;
        //

        if (messages.length > 0) {
            if (lastReadAt) {
                // Шукаємо перше непрочитане
                const firstUnread = messages.find(
                    (m) => new Date(m.createdAt) > new Date(lastReadAt)
                );

                if (firstUnread) {
                    console.log("firstUnread.current", firstUnread);

                    const element = document.getElementById(
                        `msg-${firstUnread?.id || messages[0].id}`
                    );
                    element?.scrollIntoView({ behavior: "auto", block: "center" });
                    return;
                }
            }
            // Якщо все прочитано або немає мітки — скролимо в самий кінець
            const container = scrollRef.current;
            if (container) {
                container.scrollTop = container.scrollHeight;
            }
        }
    }, [messages]);

    // Логіка автоматичного скролу
    useEffect(() => {
        if (!messages.length || didInitialScroll.current === true) return;
        //
        if (isScrollDownload.current) return;
        //

        requestAnimationFrame(() => {
            if (lastReadAt) {
                const firstUnread = messages.find(
                    (m) => new Date(m.createdAt) > new Date(lastReadAt)
                );

                if (firstUnread) {
                    const element = document.getElementById(`msg-${firstUnread.id}`);
                    if (element) {
                        element.scrollIntoView({
                            behavior: "auto",
                            block: "center",
                        });
                        didInitialScroll.current = true;
                        return;
                    }
                }
            }

            // если lastReadAt нет — скроллим в самый низ
            scrollRef.current!.scrollTop = scrollRef.current!.scrollHeight;
            didInitialScroll.current = true;
        });
    }, [messages, lastReadAt]);

    useEffect(() => {
        didInitialScroll.current = false;
    }, [activeChat]);

    useEffect(() => {
        const container = scrollRef.current;
        if (!container || !activeChat) return;

        const onScroll = () => {
            if (!isScrolledToBottom(container)) return;
            if (!messages.length) return;

            const lastMessage = messages[messages.length - 1];

            axiosInstance.post(`/api/chats/${activeChat}/read`, {
                lastMessageId: lastMessage.id,
            });

            // если закоментировать то полоса будет взегда над введенными сообщениями
            setLastReadAt(lastMessage.createdAt);
        };
        container.addEventListener("scroll", onScroll);

        return () => {
            container.removeEventListener("scroll", onScroll);
        };
    }, [messages, activeChat]);

    function isScrolledToBottom(el: HTMLDivElement) {
        const threshold = 40;
        return el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
    }

    const handleScroll = async (e: React.UIEvent<HTMLDivElement>) => {
        const container = e.currentTarget;
        const { scrollTop, scrollHeight, clientHeight } = container;

        if (isFetching.current || !activeChat) return;

        // Скрол вгору — підвантаження історії
        if (scrollTop === 0 && hasMoreBefore.current && messages.length > 0) {
            isFetching.current = true;
            const firstMsgDate = messages[0].createdAt;

            setScrollHeightBeforeUpdate(container.scrollHeight);

            isScrollDownload.current = true;

            try {
                const oldMsgs = await axiosInstance.get(
                    `/api/chats/${activeChat}/messages?cursor=${firstMsgDate}&direction=before`
                );

                if (oldMsgs.data.messages.length > 0) {
                    // Зберігаємо висоту до оновлення, щоб скрол не "стрибав"

                    const prevHeight = container.scrollHeight;
                    setMessages((prev) => [...oldMsgs.data.messages, ...prev]);

                    // Коригуємо скрол після додавання елементів вгору
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

        const isAtBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 50;

        if (isAtBottom && hasMoreAfter.current && !isFetching.current) {
            // isFetching.current = false;
            isFetching.current = true;
            const lastMessageIndex = messages.length - 1;
            const lastMsgDate = messages[lastMessageIndex].createdAt;

            try {
                const res = await axiosInstance.get(
                    `/api/chats/${activeChat}/messages?cursor=${lastMsgDate}&direction=after`
                );

                const newMsgs = res.data.messages;
                if (newMsgs.length > 0) {
                    const lastMessage = messages[messages.length - 1];
                    setLastReadAt(lastMessage.createdAt);

                    isScrollDownload.current = false;
                    setMessages((prev) => [...prev, ...newMsgs]);
                } else {
                    hasMoreAfter.current = false;
                }
            } finally {
                isFetching.current = false;
            }
        }
    };

    useLayoutEffect(() => {
        if (isScrollDownload.current && scrollRef.current && scrollHeightBeforeUpdate > 0) {
            const container = scrollRef.current;
            // Нова висота мінус стара висота = на скільки пікселів додався контент зверху
            const heightDifference = container.scrollHeight - scrollHeightBeforeUpdate;

            container.scrollTop = heightDifference;

            // Скидаємо прапори
            // isScrollDownload.current = false;
            setScrollHeightBeforeUpdate(0);
        }
    }, [messages]);

    return (
        <div className="flex h-[300px]">
            <ChatList
                chats={chats}
                activeChatId={activeChat ?? undefined}
                onSelect={setActiveChat}
            />

            {activeChat && (
                <div className="flex flex-col flex-1">
                    {/* <ChatWindow messages={messages} /> */}
                    <div
                        className="chat-window h-[500px] overflow-y-auto"
                        ref={scrollRef}
                        onScroll={handleScroll}
                    >
                        {messages.map((msg, index) => {
                            const isFirstUnread =
                                // изменить на количество сообщений какие приходят первый раз из сервера
                                messages.length === 30 &&
                                lastReadAt &&
                                new Date(msg.createdAt) > new Date(lastReadAt) &&
                                msg.sender.id !== decodeToken?.id &&
                                new Date(msg.createdAt) < sessionEntryTime.current &&
                                (index === 0 ||
                                    new Date(messages[index - 1].createdAt) <=
                                        new Date(lastReadAt));

                            return (
                                <div key={msg.id} id={`msg-${msg.id}`}>
                                    {isFirstUnread && (
                                        <div className="bg-blue-100 text-blue-600 text-center py-1 my-2 rounded">
                                            Нові повідомлення
                                        </div>
                                    )}
                                    <div
                                        className={`message-item flex gap-1
                                    ${msg.sender.id === decodeToken?.id ? "justify-self-end" : "justify-self-auto"}`}
                                    >
                                        <b>{msg.sender.firstName || msg.sender.email}:</b>{" "}
                                        {msg.text}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <MessageInput
                        onSend={(text) => {
                            isScrollDownload.current = false;
                            socketRef.current?.emit("send_message", {
                                chatId: activeChat,
                                text,
                            });
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default ChatLayout;
