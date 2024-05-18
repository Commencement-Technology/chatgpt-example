import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources";
import { Message } from "../types";

const openai = new OpenAI({
	apiKey: process.env.OPEN_AI_API_KEY,
});

type StorageMessage = OpenAI.Chat.Completions.ChatCompletionMessageParam & {
	sent: Date;
};
type ConversationStorageData = { persona: string; messages: StorageMessage[] };
const ConversationStorage: Record<string, ConversationStorageData> = {};

export class ChatGptConversationService {
	private newMessage = (
		message: OpenAI.Chat.Completions.ChatCompletionMessageParam
	) => ({ ...message, sent: new Date() });
	getConversationList = () => Promise.resolve(ConversationStorage);
	getConversation = (id: string) =>
		Promise.resolve(
			ConversationStorage[id]?.messages
				.filter((m) => m.role !== "system")
				.map<Message>((m) => ({
					text: String(m.content),
					sent: m.sent,
					source: m.role === "user" ? "user" : "bot",
				}))
		);
	startConversation = async (
		id: string,
		systemPersona: string,
		persona: string,
		message: string
	) => {
		// Starts a new conversation with the persona
		const startConversationTime = new Date();
		const startMessages: ChatCompletionMessageParam[] = [
			{ role: "system", content: systemPersona },
			{ role: "user", content: message },
		];
		const response = await openai.chat.completions.create({
			model: "gpt-3.5-turbo",
			messages: startMessages,
		});
		ConversationStorage[id] = {
			persona: persona,
			messages: startMessages
				.map((m) => ({ ...m, sent: startConversationTime }))
				.concat({
					role: "assistant",
					sent: new Date(),
					content: response.choices[0].message.content,
				}),
		};
		return response.choices[0].message.content;
	};
	sendMessages = async (
		id: string,
		messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[]
	) => {
		ConversationStorage[id].messages.push(...messages.map(this.newMessage));
		const response = await openai.chat.completions.create({
			model: "gpt-3.5-turbo",
			messages: ConversationStorage[id].messages,
		});
		ConversationStorage[id].messages.push(
			this.newMessage(response.choices[0].message)
		);
		return response.choices[0].message.content;
	};
	deleteConversation = (id: string) => {
		if (id in ConversationStorage) {
			delete ConversationStorage[id];
			return Promise.resolve(true);
		}
		return Promise.resolve(false);
	};
}
