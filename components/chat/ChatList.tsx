"use client";

import { Chat, ChatMember } from "../../types/chat";

interface Props {
    chats: ChatMember[] | undefined;
    activeChatId?: string;
    onSelect: (chatId: string) => void;
}

export function ChatList({ chats, activeChatId, onSelect }: Props) {
    // console.log("chats", chats);

    return (
        <div className="w-80 border-r overflow-y-auto pb-10">
            {chats?.map((item) => (
                <div
                    key={item.id}
                    onClick={() => onSelect(item.chat.id)}
                    className={`p-4 cursor-pointer flex justify-between ${
                        item.chat.id === activeChatId ? "bg-green-400" : ""
                    }`}
                >
                    <span>{item.chat.academicGroup?.name}</span>

                    {/* {chat.unreadCount > 0 && (
                        <span className="bg-blue-600 text-white rounded-full px-2 text-sm">
                            {chat.unreadCount}
                        </span>
                    )} */}
                </div>
            ))}
        </div>
    );
}
