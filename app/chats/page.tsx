// import { useEffect, useRef, useState } from "react";
import ChatLayout from "@/components/chat/ChatLayout";
// import { ChatList } from "@/components/chat/ChatList";
// import { ChatWindow } from "@/components/chat/ChatWindow";
// import { MessageInput } from "@/components/chat/MessageInput";
// import axiosInstance from "../../utils/axios/axios-interceptor";
// import { Chat, ChatMember, Message } from "../../types/chat";
// import { connectSocket } from "../../utils/api/socket";
// import { Socket } from "socket.io-client";
// import { useProfileFromCache } from "../../utils/query/profile-query-cache";
import { useProfileQuery } from "../../utils/query/profile-query";
import { getDecodedUserFromCookies } from "../../utils/auth.server";

export default async function ChatsPage() {
    const decode = await getDecodedUserFromCookies();

    return <ChatLayout decodeToken={decode} />;
}
