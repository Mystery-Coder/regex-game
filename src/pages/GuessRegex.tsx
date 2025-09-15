import { Box, Button, TextField, Typography } from "@mui/material";
import { useState } from "react";

export default function GuessRegex() {
	const [joinRoom, setJoinRoom] = useState(false);

	const createRoomAndJoin = async () => {
		try {
			const res = await fetch("http://localhost:8080/create_room");
			if (!res.ok) {
				throw new Error("Failed to create room");
			}

			const data = await res.json();
			console.log(data.RoomID);

			const add_player_res = await fetch(
				"http://localhost:8080/add_player",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ RoomID: data.RoomID }),
				}
			);

			if (!add_player_res.ok) {
				const errorData = await add_player_res.json();
				throw new Error(errorData.error || "Failed to add player");
			}
			const player_data = await add_player_res.json();
			console.log(player_data);
		} catch (e) {
			console.log(e);
		}
	};

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
				{!joinRoom && (
					<Button onClick={() => createRoomAndJoin()}>
						Create 1v1 Room
					</Button>
				)}
				<Button onClick={() => setJoinRoom(true)}>Join 1v1 Room</Button>
			</Box>
		</Box>
	);
}
