import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import SetupRegexGame from "./pages/SetupRegexGame";
import SetupStringGame from "./pages/SetupStringGame";
import RegexGame from "./pages/RegexGame";
import StringGame from "./pages/StringGame";

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/about" element={<About />} />
				<Route path="/setup_regex_game" element={<SetupRegexGame />} />
				<Route
					path="/setup_string_game"
					element={<SetupStringGame />}
				/>
				<Route path="/regex_game" element={<RegexGame />} />
				<Route path="/string_game" element={<StringGame />} />
			</Routes>
		</Router>
	);
}

export default App;
