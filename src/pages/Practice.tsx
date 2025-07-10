import { useEffect, useState } from "react";
import { Container, Form } from "react-bootstrap";

export default function Practice() {
	const [regexInput, setRegexInput] = useState("");
	const [testText, setTestText] = useState(
		"Here are few numbers, 999-687-1221 121-434-2351"
	);
	const [isValid, setIsValid] = useState(true);
	const [matches, setMatches] = useState<string[]>([]);

	useEffect(() => {
		try {
			const regex = new RegExp(regexInput, "g");
			const result = testText.match(regex);
			setMatches(result || []);
			setIsValid(true);
		} catch (e) {
			setIsValid(false);
			setMatches([]);
		}
	}, [regexInput, testText]);

	return (
		<div className="min-vh-100" style={{ background: "#7EE8FA" }}>
			<Container className="pt-2">
				<h1 className="mb-3">Practice Regex</h1>
				<p className="mb-4">
					Type a regular expression below and test it against some
					sample text.
				</p>
				<Container>{testText}</Container>
			</Container>
		</div>
	);
}
