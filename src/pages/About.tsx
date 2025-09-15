import { Box, Typography } from "@mui/material";

export default function About() {
	return (
		<Box className="center-content">
			<Typography variant="h2">Regex Battle</Typography>
			<Typography variant="h5">
				Hone your Regular Expression skills by battling 1v1, Practice
				RegEx at{" "}
				<a
					href="https://regexr.com/"
					target="_blank"
					style={{
						textDecoration: "none",
						color: "rgba(114, 152, 255, 1)",
					}}
				>
					RegExr
				</a>
			</Typography>
		</Box>
	);
}
