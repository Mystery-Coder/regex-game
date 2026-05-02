import { Box, Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { AddPlayerRes, CreateRoomRes, Player } from "../types";

const BACKEND = import.meta.env.VITE_BACKEND_URL ?? "http://localhost:8080";

export default function SetupStringGame() {
	const [joinRoom, setJoinRoom] = useState(false);
	const [roomID, setRoomID] = useState("");

	const navigator = useNavigate();

	const createRoomAndJoin = async () => {
		try {
			const res = await fetch(
				`${BACKEND}/create_room?question_type=regex`,
			);
			if (!res.ok) {
				let err = await res.json();
				throw new Error("Failed to create room " + err);
			}

			const createRoomData: CreateRoomRes = await res.json();
			console.log(createRoomData.RoomID);

			const add_player_res = await fetch(`${BACKEND}/add_player`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ RoomID: createRoomData.RoomID }),
			});

			if (!add_player_res.ok) {
				const errorData = await add_player_res.json();
				throw new Error(errorData.error || "Failed to add player");
			}
			const addPlayerData: AddPlayerRes = await add_player_res.json();

			const PlayerData: Player = {
				PlayerID: addPlayerData.PlayerID,
				RoomID: createRoomData.RoomID,
			};
			navigator("/string_game", {
				state: PlayerData,
			});
		} catch (e) {
			console.log(e);
		}
	};

	const handleJoinRoom = async () => {
		if (joinRoom === false) {
			setJoinRoom(true);
			return;
		}

		const add_player_res = await fetch(`${BACKEND}/add_player`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ RoomID: roomID }),
		});

		if (!add_player_res.ok) {
			const errorData = await add_player_res.json();
			throw new Error(errorData.error || "Failed to add player");
		}
		const addPlayerData: AddPlayerRes = await add_player_res.json();

		const PlayerData: Player = {
			PlayerID: addPlayerData.PlayerID,
			RoomID: roomID,
		};
		navigator("/string_game", {
			state: PlayerData,
		});
	};

	return (
		<Box className="center-content-horizontal">
			<Typography variant="h2">Guess the String</Typography>
			<Typography variant="h5">
				Provide a string which matches the Regular Expression
			</Typography>
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					gap: "1.4rem",
					margin: "170px",
				}}
			>
				{joinRoom && (
					<TextField
						label="Room ID"
						onChange={(e) => setRoomID(e.target.value)}
					></TextField>
				)}
				{!joinRoom && (
					<Button onClick={() => createRoomAndJoin()}>
						Create 1v1 Room
					</Button>
				)}
				<Button onClick={() => handleJoinRoom()}>Join 1v1 Room</Button>
			</Box>
		</Box>
	);
}
