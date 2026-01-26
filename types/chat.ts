// export interface Chat {
//     id: string;
//     academicGroup: {
//         id: string;
//         name: string;
//     };
//     unreadCount: number;
// }

import { AcademicGroup } from "./academicGroup";
import { UserProfile } from "./user";

export interface ChatMember {
    id: string;
    joinedAt: Date;
    lastReadAt: Date | null;
    chat: Chat;
    user: UserProfile;
}

export interface Chat {
    id: string;
    createdAt: Date;
    academicGroup: AcademicGroup;
}

// export interface Message {
//     id: string;
//     text: string;
//     sender: {
//         id: string;
//         firstName: string;
//         lasName: string;
//         email: true;
//     };
//     createdAt: string;
// }

export interface MessageResponse {
    messages: Message[];
    lastReadAt: number;
}

export interface Message {
    id: string;
    text: string;
    sender: {
        id: string;
        firstName: string;
        lasName: string;
        email: true;
    };
    createdAt: string;
}
