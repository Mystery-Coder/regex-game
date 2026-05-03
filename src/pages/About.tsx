import { Box, Heading, Link, Text } from "@radix-ui/themes";

export default function About() {
	return (
		<Box className="center-content">
			<Heading size="7">Regex Battle</Heading>
			<Text size="4" align="center">
				Hone your Regular Expression skills by battling 1v1, Practice
				RegEx at{" "}
				<Link
					href="https://regexr.com/"
					target="_blank"
					rel="noreferrer"
				>
					RegExr
				</Link>
			</Text>
		</Box>
	);
}
