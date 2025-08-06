import { Conversation, Message } from "@/types";

/**
 * Deduplicate & merge messages.
 * Always sorts newest first.
 */
export function upsertMessages(existing: Message[], incoming: Message[]): Message[] {
    if (!existing?.length && !incoming?.length) return [];

    const map = new Map(existing.map(m => [m.id, m]));

    for (const msg of incoming) {
        if (map.has(msg.id)) {
            const local = map.get(msg.id)!;
            map.set(msg.id, {
                ...local,
                ...msg,
                seenBy: Array.from(new Set([...(local.seenBy || []), ...(msg.seenBy || [])])),
                updatedAt: msg.updatedAt ?? local.updatedAt,
            });
        } else {
            map.set(msg.id, msg);
        }
    }

    return Array.from(map.values()).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

/**
 * Merge local & API conversations, preserving messages & local data.
 */
export function mergeConversations(
    localConversations: Conversation[],
    apiConversations: Conversation[]
): Conversation[] {
    const localMap = new Map(localConversations.map(conv => [conv.id, conv]));

    for (const apiConv of apiConversations) {
        const localConv = localMap.get(apiConv.id);

        if (localConv) {
            localMap.set(apiConv.id, {
                ...localConv,
                ...apiConv,
                messages: upsertMessages(localConv.messages || [], apiConv.messages || []),
                lastMessageContent: apiConv.lastMessageContent ?? localConv.lastMessageContent,
                totalUnreadMessagesCount: apiConv.totalUnreadMessagesCount ?? localConv.totalUnreadMessagesCount,
                lastMessageCreatedAt: apiConv.lastMessageCreatedAt ?? localConv.lastMessageCreatedAt,
                messagesAllRead: apiConv.messagesAllRead ?? localConv.messagesAllRead,
                updatedAt: apiConv.updatedAt ?? localConv.updatedAt,
            });
        } else {
            localMap.set(apiConv.id, {
                ...apiConv,
                messages: upsertMessages([], apiConv.messages || []),
            });
        }
    }

    return Array.from(localMap.values());
}
