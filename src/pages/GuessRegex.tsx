import { Box, Button, TextField, Typography } from "@mui/material";
import { useState } from "react";

export default function GuessRegex() {
	const [joinRoom, setJoinRoom] = useState(false);
	return (
		<Box className="center-content-horizontal">
			<Typography variant="h2">Guess the Regex</Typography>
			<Typography variant="h5">
				Write a Regular Expression to match 3 strings shown
			</Typography>
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					gap: "1.4rem",
					margin: "170px",
				}}
			>
				{joinRoom && <TextField label="Room ID"></TextField>}
				{!joinRoom && <Button>Create 1v1 Room</Button>}
				<Button onClick={() => setJoinRoom(true)}>Join 1v1 Room</Button>
			</Box>
		</Box>
	);
}
