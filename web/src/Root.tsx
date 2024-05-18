import { useState, useEffect } from "react";
import { getConversationList, getPersonas } from "./api";
import { ConversationList, ConversationWindow } from "./conversation";
import { Persona } from "./persona/types";
import { Conversation } from "./conversation/types";

export const Root = () => {
	const [conversation, setConversation] = useState<Conversation>();
	const [personas, setPersonas] = useState<Persona[]>([]);
	const [persona, setPersona] = useState<Persona | undefined>();
	const [conversations, setConversations] = useState<Conversation[]>([]);
	useEffect(() => {
		getPersonas().then(setPersonas);
		refreshConversations();
	}, []);
	const refreshConversations = () => {
		getConversationList().then((conversations) => {
			setConversations(conversations);
		});
	};
	const handleLoadConversation = (conversation: Conversation) => {
		setConversation(conversation);
		setPersona(personas.find((p) => p.id === conversation.persona));
	};
	const handleStartConversation = () => {
		refreshConversations();
	};
	return (
		<div className="root">
			<ConversationList
				conversations={conversations}
				personas={personas}
				onLoadConversation={handleLoadConversation}
			/>
			<ConversationWindow
				key={conversation?.id}
				conversation={conversation}
				personas={personas}
				persona={persona}
				onStartConversation={handleStartConversation}
			/>
		</div>
	);
};
