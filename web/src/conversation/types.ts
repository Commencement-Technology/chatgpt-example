export type Conversation = {
	id: string;
	persona: string;
	firstMessage: Message;
};
export type Message = {
	source: "user" | "bot";
	sent: Date;
	text: string;
};
