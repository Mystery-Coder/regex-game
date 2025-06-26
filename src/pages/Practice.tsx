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
		<Container className="mt-4">
			<h1 className="mb-3">Practice Regex</h1>
			<p className="mb-4">
				Type a regular expression below and test it against some sample
				text.
			</p>

			<Form>
				<Form.Group className="mb-3">
					<Form.Label>Regular Expression</Form.Label>
					<Form.Control
						type="text"
						placeholder="e.g. \d{3}-\d{2}-\d{4}"
						value={regexInput}
						onChange={(e) => setRegexInput(e.target.value)}
						isInvalid={!isValid}
					/>
					<Form.Control.Feedback type="invalid">
						Invalid regular expression.
					</Form.Control.Feedback>
				</Form.Group>

				<Form.Group className="mb-3">
					<Form.Label>Test Text</Form.Label>
					<Form.Control
						as="textarea"
						rows={4}
						value={testText}
						onChange={(e) => setTestText(e.target.value)}
					/>
				</Form.Group>
			</Form>
		</Container>
	);
}
