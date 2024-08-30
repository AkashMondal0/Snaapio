// interface User {
//     _id: string;
//     username: string;
//     email: string;
//     password: string;
//     profilePicture?: string;
//     coverPicture?: string;
//     followers?: string[];
//     followings?: string[];
//     privateIds?: string[];
//     groupIds?: string[];
//     bio?: string;
//     city?: string;
//     from?: string;
//     updatedAt?: string;
//     createdAt?: string;
// }

// interface File {
//     url: string;
//     type: 'image' | 'video' | 'audio' | 'file';
// }

// interface PrivateMessage {
//     _id: string;
//     content: string;
//     fileUrl?: File[];
//     memberId: string;
//     conversationId: string;
//     deleted: boolean;
//     seenBy: User[];
//     deliveredTo: User[];
// }

// interface PrivateChat {
//     _id?: string;
//     users?: User[];
//     lastMessageContent: string;
//     messages?: PrivateMessage[];
//     updatedAt?: string;
//     createdAt?: string;
// }
// interface GroupMessage {
//     content: string;
//     fileUrl: File[];
//     memberId: string;
//     groupId: string;
//     deleted: boolean;
//     seenBy: User[];
//     deliveredTo: User[];
// }

// interface GroupChat {
//     _id: string;
//     name: string;
//     description: string;
//     admins?: User[];
//     members: User[];
//     lastMessageContent: string;
//     messages?: GroupMessage[];
//     updatedAt?: string;
//     createdAt?: string;
// }

// export {
//     User,
//     PrivateMessage,
//     PrivateChat,
//     File,
//     GroupMessage,
//     GroupChat,
// };