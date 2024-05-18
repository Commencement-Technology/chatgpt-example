export type Message = { text: string; sent: Date; source: string };
export type Conversation = Message[];
export type ConversationListEntry = {
	id: string;
	persona: string;
	firstMessage: Message;
};
export type ConversationList = ConversationListEntry[];
export interface ConversationService {
	getConversationList: () => Promise<ConversationList>;
	getConversation: (id: string) => Promise<Conversation>;
	createConversation: (
		id: string,
		persona: string,
		initial: Message
	) => Promise<Conversation>;
	updateConversation: (id: string, message: Message) => Promise<Conversation>;
	deleteConversation: (id: string) => Promise<boolean>;
}
