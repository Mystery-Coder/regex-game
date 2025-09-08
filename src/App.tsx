import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import GuessRegex from "./pages/GuessRegex";
import GuessPattern from "./pages/GuessPattern";
function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/about" element={<About />} />
				<Route path="/guess_regex" element={<GuessRegex />} />
				<Route path="/guess_pattern" element={<GuessPattern />} />
			</Routes>
		</Router>
	);
}

export default App;
