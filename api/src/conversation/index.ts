import { personas } from "../persona";
import { ChatGptConversationService } from "./chatgpt";
import {
	Conversation,
	ConversationList,
	ConversationListEntry,
	ConversationService,
	Message,
} from "./types";

export class InMemoryConversationService implements ConversationService {
	chatgpt: ChatGptConversationService;
	constructor() {
		this.chatgpt = new ChatGptConversationService();
	}
	getConversationList = async (): Promise<ConversationList> => {
		const conversations = await this.chatgpt.getConversationList();
		if (!conversations) {
			return [];
		}
		return Object.keys(conversations).map<ConversationListEntry>((key) => {
			const firstMessage = conversations[key].messages.filter(
				(sm) => sm.role === "user"
			)[0];
			return {
				id: key,
				persona: conversations[key].persona,
				firstMessage: {
					text: String(firstMessage.content),
					sent: firstMessage.sent,
					source: firstMessage.role,
				},
			};
		});
	};
	getConversation = async (id: string): Promise<Conversation> => {
		const messages = await this.chatgpt.getConversation(id);
		if (!messages) {
			return [];
		}
		return messages;
	};
	createConversation = async (
		id: string,
		persona: string,
		initial: Message
	) => {
		const startingPrompt = personas[persona].prompt;
		const response = await this.chatgpt.startConversation(
			id,
			startingPrompt,
			persona,
			initial.text
		);

		if (!response) {
			throw new Error("No response from ChatGPT");
		}
		return this.chatgpt.getConversation(id);
	};
	updateConversation = async (id: string, message: Message) => {
		const response = await this.chatgpt.sendMessages(id, [
			{ role: "user", content: message.text },
		]);

		if (!response) {
			throw new Error("No response from ChatGPT");
		}
		return this.chatgpt.getConversation(id);
	};
	deleteConversation = (id: string) => {
		return this.chatgpt.deleteConversation(id);
	};
}
