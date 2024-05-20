import { useEffect, useMemo, useState } from "react";
import { Conversation, Message } from "./types";
import { getMessages, sendMessage, startConversation } from "../api";
import { v4 as uuid } from "uuid";
import { PersonaContactIcon, PersonaList } from "../persona";
import { Persona } from "../persona/types";

type ConversationWindowProps = {
	conversation?: Conversation;
	personas: Persona[];
	persona?: Persona;
	onStartConversation?: () => void;
};
export const ConversationWindow = ({
	conversation,
	personas,
	persona,
	onStartConversation,
}: ConversationWindowProps) => {
	const [currentConverstionId, setCurrentConversationId] = useState(
		conversation?.id ?? undefined
	);
	const [currentPersona, setCurrentPersona] = useState<Persona | undefined>(
		persona
	);
	const handleChangePersona = (p: Persona) => {
		setCurrentPersona(p);
		setCurrentConversationId(uuid());
	};
	return (
		<div className="conversation-window">
			<PersonaList
				personas={personas}
				onSelectPersona={handleChangePersona}
			/>

			{currentConverstionId === undefined ||
			currentPersona === undefined ? (
				<span>Select a persona</span>
			) : (
				<ConversationContent
					key={currentConverstionId}
					id={currentConverstionId}
					persona={currentPersona}
					onStartConversation={onStartConversation}
				/>
			)}
		</div>
	);
};

type Conversationprops = {
	id: string;
	persona: Persona;
	onStartConversation?: () => void;
};
const ConversationContent = ({
	id,
	persona,
	onStartConversation,
}: Conversationprops) => {
	const [isStarted, setIsStarted] = useState(false);
	const [conversation, setConversation] = useState<Message[]>([]);
	useEffect(() => {
		if (id) {
			getMessages(id).then((messages) => {
				if (messages.length > 0) {
					setConversation(messages);
					setIsStarted(true);
				}
			});
		}
	}, [id]);
	const handleSendMessage = (message: string) => {
		if (isStarted) {
			sendMessage(id, message).then((response) =>
				setConversation(response)
			);
		} else {
			startConversation(id, persona.id, message).then((response) => {
				setConversation(response);
				setIsStarted(true);
				onStartConversation?.();
			});
		}
	};
	const conversationList = useMemo(
		() =>
			conversation
				.sort((a, b) => (new Date(a.sent) < new Date(b.sent) ? -1 : 1))
				.map((msg) => <ConversationMessage {...msg} />),
		[conversation]
	);
	return (
		<>
			<div className="conversation-container">
				<div className="persona-contact">
					<PersonaContactIcon persona={persona} />
					<div>{persona.name}</div>
				</div>
				<div className="conversation">{conversationList}</div>
			</div>
			<UserInput onSendMessage={handleSendMessage} />
		</>
	);
};

type UserInputProps = {
	onSendMessage?: (message: string) => void;
};
const UserInput = ({ onSendMessage }: UserInputProps) => {
	const [text, setText] = useState("");
	const handleSendMessage = () => {
		onSendMessage?.(text);
		setText("");
	};
	return (
		<div className="conversation-input">
			<textarea
				className="user-input"
				value={text}
				onChange={(ev) => setText(ev.target.value)}
				rows={4}
			/>
			<button className="send" onClick={handleSendMessage}>
				Send
			</button>
		</div>
	);
};

const ConversationMessage = (message: Message) => {
	return <div className={message.source}>{message.text}</div>;
};
