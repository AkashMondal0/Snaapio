import { Conversation, Message } from "@/types";

export function mergeConversations(
	localConversations: Conversation[],
	apiConversations: Conversation[]
  ): Conversation[] {
	const localMap = new Map(localConversations.map(conv => [conv.id, conv]));
  
	const mergedConversations = apiConversations.map(apiConv => {
	  const localConv = localMap.get(apiConv.id);
  
	  if (localConv) {
		return {
		  ...localConv, // Keep local properties
		  ...apiConv, // Overwrite with API data
		  messages: mergeMessages(localConv.messages, apiConv.messages),
		  lastMessageContent: apiConv.lastMessageContent || localConv.lastMessageContent,
		  totalUnreadMessagesCount: apiConv.totalUnreadMessagesCount ?? localConv.totalUnreadMessagesCount,
		  lastMessageCreatedAt: apiConv.lastMessageCreatedAt || localConv.lastMessageCreatedAt,
		  messagesAllRead: apiConv.messagesAllRead ?? localConv.messagesAllRead,
		  updatedAt: apiConv.updatedAt || localConv.updatedAt,
		};
	  }
  
	  return apiConv;
	});
  
	// Add local-only conversations not present in API
	localConversations.forEach(localConv => {
	  if (!apiConversations.some(apiConv => apiConv.id === localConv.id)) {
		mergedConversations.push(localConv);
	  }
	});
  
	return mergedConversations;
  }
  

  export function mergeMessages(localMessages: Message[], apiMessages: Message[]): Message[] {
	const messageMap = new Map(localMessages.map(msg => [msg.id, msg]));
  
	apiMessages.forEach(apiMsg => {
	  if (!messageMap.has(apiMsg.id)) {
		messageMap.set(apiMsg.id, apiMsg);
	  } else {
		const localMsg = messageMap.get(apiMsg.id);
		messageMap.set(apiMsg.id, {
		  ...localMsg,
		  ...apiMsg, // Merge API data
		  seenBy: Array.from(new Set([...(localMsg?.seenBy || []), ...apiMsg.seenBy])), // Combine seenBy users
		  updatedAt: apiMsg.updatedAt ?? localMsg?.updatedAt,
		});
	  }
	});
  
	return Array.from(messageMap.values()).sort(
	  (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
	);
  }
  