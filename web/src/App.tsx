import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { Root } from "./Root";

function App() {
	return (
		<div className="App">
			<header className="App-header">Advice GPT</header>
			<div className="App-Body">
				<BrowserRouter>
					<Routes>
						<Route path="/" element={<Root />} />
					</Routes>
				</BrowserRouter>
			</div>
		</div>
	);
}

export default App;
