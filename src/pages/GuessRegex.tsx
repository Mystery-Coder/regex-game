import { Box, Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { AddPlayerRes, CreateRoomRes, Player } from "../types";

export default function GuessRegex() {
	const [joinRoom, setJoinRoom] = useState(false);
	const [roomID, setRoomID] = useState("");

	const navigator = useNavigate();

	const createRoomAndJoin = async () => {
		try {
			const res = await fetch("http://localhost:8080/create_room");
			if (!res.ok) {
				throw new Error("Failed to create room");
			}

			const createRoomData: CreateRoomRes = await res.json();
			console.log(createRoomData.RoomID);

			const add_player_res = await fetch(
				"http://localhost:8080/add_player",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ RoomID: createRoomData.RoomID }),
				}
			);

			if (!add_player_res.ok) {
				const errorData = await add_player_res.json();
				throw new Error(errorData.error || "Failed to add player");
			}
			const addPlayerData: AddPlayerRes = await add_player_res.json();

			const PlayerData: Player = {
				PlayerID: addPlayerData.PlayerID,
				RoomID: createRoomData.RoomID,
			};
			navigator("/regex_game", {
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

		const add_player_res = await fetch("http://localhost:8080/add_player", {
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
		navigator("/regex_game", {
			state: PlayerData,
		});
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
