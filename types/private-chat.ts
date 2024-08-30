import { User } from "./profile";

export interface File {
    url: string;
    type: 'image' | 'video' | 'audio' | 'file';
    caption?: string
}

export interface PrivateMessage {
    _id?: string;
    memberDetails?: User;
    content: string;
    fileUrl?: File[] | null;
    memberId: string;
    senderId: string;
    receiverId?: string;
    receiverIds?: string[];
    conversationId: string;
    deleted: boolean;
    seenBy: [User['_id']];
    deliveredTo?: [User['_id']];
    createdAt: string | Date | any;
    updatedAt: string | Date | any;
    replyTo?: {
        _id: string;
        content: string;
        memberId: string;
        conversationId: string;
        deleted: boolean;
        replyContent: PrivateMessage;
    };
    typeDate?: Boolean;
}

export interface PrivateChat {
    _id?: string;
    users?: [
        User['_id'],
    ];
    userDetails?: User;
    lastMessageContent: string;
    messages?: PrivateMessage[];
    updatedAt?: string | Date;
    createdAt?: string | Date;
    typing?: boolean;
    loadAllMessages?: boolean | undefined;
    page?: number | undefined;
}

export interface PrivateMessageSeen {
    messageIds: string[];
    memberId: string;
    receiverId?: string;
    conversationId: string;
    createdAt?: string;
    updatedAt?: string;
    receiverIds?: string[];
}

export interface typingState {
    conversationId: string;
    senderId: string;
    receiverId: string;
    typing: boolean;

}

enum Role {
    admin =
    "admin",
    member =
    "member",
    coAdmin =
    "co-admin",
}
export interface GroupConversation {
    _id?: string;
    name?: string;
    picture?: string;
    description?: string;
    members?: [
        {
            role: Role,
            userId: string,
            _id: string
        },
    ];
    createdBy?: User['_id'];
    createdAt?: string | Date;
    updatedAt?: string | Date;
    lastMessageContent?: string;
    messages?: PrivateMessage[];
    typing?: boolean;
    loadAllMessages?: boolean;
    page?: number;
    Users?: User[];
}