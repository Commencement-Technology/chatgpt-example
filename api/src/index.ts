import express from "express";
import { InMemoryConversationService } from "./conversation";
import { getPersonas } from "./persona";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());
const inMemoryDB = new InMemoryConversationService();
app.route("/").get((req, res) => {
	res.send("Hello World");
});
app.route("/persona").get(async (req, res) => {
	const personas = getPersonas();
	const personaMap = personas.map((p) => ({
		id: p.id,
		name: p.name,
		imageUri: p.imageUri,
	}));
	res.status(200).send(personaMap);
});
app.route("/conversation").get(async (req, res) => {
	const conversations = await inMemoryDB.getConversationList();
	res.status(200).send(conversations);
});
app.route("/conversation/:id")
	.get(async (req, res) => {
		//get a conversation
		const { id } = req.params;
		const response = await inMemoryDB.getConversation(id);
		res.status(200).send(response);
	})
	.post(async (req, res) => {
		//start a new conversation
		const { id } = req.params;
		const { persona, message } = req.body;
		const response = await inMemoryDB.createConversation(id, persona, {
			text: message,
			sent: new Date(),
			source: "user",
		});
		res.status(200).send(response);
	})
	.put(async (req, res) => {
		//continue an ongoing conversation
		const { id } = req.params;
		const { message } = req.body;
		const response = await inMemoryDB.updateConversation(id, {
			text: message,
			sent: new Date(),
			source: "user",
		});
		res.status(200).send(response);
	})
	.delete(async (req, res) => {
		//I'm embarrassed for this to stay in my history
		const { id } = req.params;
		const response = await inMemoryDB.deleteConversation(id);
		res.status(200).send(response);
	});

const run = () => {
	const port = process.env.port || 3000;
	app.listen(port, () => {
		console.log(`Server is running on ${port}`);
	});
};
run();
