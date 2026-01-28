"use client";

import { useState } from "react";

interface Props {
    onSend: (text: string) => void;
}

export function MessageInput({ onSend }: Props) {
    const [text, setText] = useState("");

    return (
        <div className="border-t p-3 flex gap-2">
            <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="flex-1 border rounded px-3"
                placeholder="Написати повідомлення..."
                onKeyDown={(e) => {
                    if (e.code === "Enter") {
                        // шуфруем текст

                        onSend(text);
                        setText("");
                    }
                }}
            />
            <button
                onClick={() => {
                    onSend(text);
                    setText("");
                }}
                className="bg-blue-600 text-white px-4 rounded"
            >
                ➤
            </button>
        </div>
    );
}
