export type loadingType = 'idle' | 'pending' | 'normal'
export interface PageProps<T> {
    navigation?: NavigationProps;
    route?: {
        params?:T,
        name: string;
        key: string;
    }
}
export type Theme = "light" | "dark" | "system";
export interface NavigationProps {
    addListener: (type: string, callback: () => void) => void,
    canGoBack: () => boolean,
    dangerouslyGetParent: () => any,
    dangerouslyGetState: () => any,
    dispatch: (action: any) => void,
    goBack: () => void,
    isFocused: () => boolean,
    navigate: (name: string, params?: any) => void,
    pop: () => void,
    popToTop: () => void,
    push: (name: string, params: any) => void,
    removeListener: (type: string, callback: () => void) => void,
    replace: (name: string, params: any) => void,
    reset: (state: any) => void,
    setOptions: (options: any) => void,
    setParams: (params: any) => void,
    toggleDrawer: () => void,
}
// user account
export interface Session {
    user: {
        id: string,
        username: string,
        email: string,
        name: string,
        profilePicture: string,
        accessToken: string,
        bio: string,
    } | null
}
export interface AuthorData {
    id: string
    username: string
    email: string
    name: string
    profilePicture?: string | null
    followed_by?: boolean
    following?: boolean
    bio?: string;
    website?: string[] | any[];
}
export enum Role {
    User = 'user',
    Admin = 'admin',
}
export type User = {
    id: string;
    username: string;
    name: string;
    email: string;
    password?: string; // Password might not be returned
    profilePicture: string | null;
    bio: string | null;
    website: string[] | any[];
    createdAt?: Date | string | null | unknown;
    updatedAt?: Date | string | null | unknown;
    isVerified?: boolean | false | null;
    isPrivate?: boolean | false | null;

    friendship: {
        followed_by: boolean; // if the user is followed by the following
        following: boolean; // if the user is following the following
    }
    postCount: number;
    followerCount: number;
    followingCount: number;
}
export enum FriendshipStatus {
    // 'pending', 'accepted', 'rejected', 'blocked', 'deleted'
    Pending = 'pending',
    Accepted = 'accepted',
    Rejected = 'rejected',
    Blocked = 'blocked',
    Deleted = 'deleted',
}
export type Friendship = {
    id?: string;
    followingUsername?: string;
    authorUsername?: string;
    followingUserId?: string;
    authorUserId?: string;
    createdAt?: Date | string | unknown;
    updatedAt?: Date | string | unknown;
    status?: FriendshipStatus | string;
}
// message
export interface Message {
    id: string;
    content: string;
    fileUrl: Assets[];
    authorId: string;
    deleted: boolean;
    seenBy: string[];
    conversationId: string;
    createdAt: Date | string;
    updatedAt: Date | string;
    user?: AuthorData | null;
    tempMessageId?: string;
}
export interface Conversation {
    id: string;
    members: string[];
    authorId: string;
    messages: Message[]
    user?: AuthorData | User | null
    isGroup: boolean | null;
    lastMessageContent: string | null;
    totalUnreadMessagesCount: number;
    lastMessageCreatedAt: Date | string;
    messagesAllRead?: boolean;
    createdAt?: Date | null;
    updatedAt?: Date | null;
    groupName?: string | null;
    groupImage?: string | null;
    groupDescription?: string | null;

}
export type Typing = {
    typing: boolean
    authorId: string
    members: string[]
    conversationId: string
    isGroup: boolean
    groupUser?: AuthorData
}
// user post and content
export interface Post {
    id: string
    fileUrl: Assets[]
    commentCount: number
    likeCount: number
    createdAt: Date | string
    comments: Comment[]
    likes: AuthorData[]
    isDummy?: boolean
    content: string;
    title: string;
    updatedAt?: Date;
    is_Liked: boolean;
    user: AuthorData;
    song?: string[];
    tags?: string[]
    locations?: string[];
    country?: string;
    city?: string;
}
export interface Comment {
    id: string;
    content: string;
    authorId: string;
    postId: string;
    createdAt: Date | string;
    updatedAt: Date | null;
    user: {
        username: string
        email: string
        name: string
        profilePicture: string
    }

}
export type Assets = {
    id?: string,
    urls?: {
        low?: string | null,
        medium?: string| null,
        high?: string| null,
        blur?: string| null,
        thumbnail?: string| null,
    }
    type?: 'photo' | 'video' | 'audio' | "text"
    caption?: string;
}
export type findDataInput = {
    username?: string
    id?: string
    offset: number
    limit: number
}
// api response
export type GraphqlError = {
    message: string
    locations: {
        line: number
        column: number
    }[]
    path: string[]
    extensions: {
        code: string
        originalError: {
            message: string
            statusCode: number
        }
        stacktrace: string[]
    }
}
export interface ApiResponse<T> {
    code: 0 | 1,
    message: string,
    data: T,
}
export type disPatchResponse<T> = {
    payload: T,
    error: any
}
// notification
export enum NotificationType {
    Like = 'like',
    Comment = 'comment',
    Follow = 'follow',
    Mention = 'mention',
    Reply = 'reply',
    Tag = 'tag',
    Reel = 'reel',
    Story = 'story',
    Post = 'post',
}
export type Notification = {
    id: string;
    type: NotificationType;
    authorId: string;
    recipientId: string;
    postId?: string;
    commentId?: string;
    storyId?: string;
    reelId?: string;
    createdAt: Date;
    seen: boolean;
    author?: AuthorData
    post?: Post
    comment?: Comment
}