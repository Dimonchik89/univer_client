"use client";

import { useEffect, useRef } from "react";
import { Message } from "../../types/chat";

interface Props {
    messages: Message[];
}

export function ChatWindow({ messages }: Props) {
    const bottomRef = useRef<HTMLDivElement>(null);

    console.log("chatWindow", messages);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {messages.map((msg) => (
                <div key={msg.id}>
                    <div className="text-sm text-gray-500">
                        {msg.sender.firstName || msg.sender.email}
                    </div>
                    <div className="bg-gray-100 inline-block p-2 rounded">{msg.text}</div>
                </div>
            ))}
            <div ref={bottomRef} />
        </div>
    );
}
