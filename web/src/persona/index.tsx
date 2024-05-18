import { Persona } from "./types";
type PersonaListProps = {
	personas: Persona[];
	onSelectPersona?: (persona: Persona) => void;
};
export const PersonaList = ({
	personas,
	onSelectPersona,
}: PersonaListProps) => {
	return (
		<div className="App-Personas">
			{personas.map((p) => (
				<div className="persona" onClick={() => onSelectPersona?.(p)}>
					<img
						className="persona-image"
						src={p.imageUri ?? "./anon.png"}
						alt={p.name}
					/>
					<div className="persona-name">
						<div>
							<strong>{p.name}</strong>
						</div>
						<div>{p.id}</div>
					</div>
				</div>
			))}
		</div>
	);
};

type PersonContactProps = {
	size?: string;
	persona: Persona;
};
export const PersonaContactIcon = ({ size, persona }: PersonContactProps) => {
	const classes = [
		"persona-contact-icon",
		size === "sm" ? "small" : undefined,
	]
		.filter(Boolean)
		.join(" ");
	return (
		<div className={classes}>
			<img src={persona.imageUri ?? "./anon.png"} alt={persona.name} />
			<div className="persona-contact-name">
				{persona.name.substring(0, 1)}
			</div>
		</div>
	);
};
