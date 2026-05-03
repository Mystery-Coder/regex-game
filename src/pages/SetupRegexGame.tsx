import { Box, Button, Flex, Heading, Text, TextField } from "@radix-ui/themes";
import { useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import type { AddPlayerRes, CreateRoomRes, Player } from "../types";

const BACKEND = import.meta.env.VITE_BACKEND_URL ?? "http://localhost:8080";

export default function SetupRegexGame() {
	const [joinRoom, setJoinRoom] = useState(false);
	const [roomID, setRoomID] = useState("");

	const navigator = useNavigate();

	const createRoomAndJoin = async () => {
		try {
			const res = await fetch(
				`${BACKEND}/create_room?question_type=strings`,
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
		navigator("/regex_game", {
			state: PlayerData,
		});
	};

	return (
		<Box className="center-content-horizontal">
			<Heading size="7">Guess the Regex</Heading>
			<Text size="4" align="center">
				Write a Regular Expression to match 3 strings shown
			</Text>
			<Flex direction="column" style={{ gap: "1.4rem", margin: "170px" }}>
				{joinRoom && (
					<TextField.Root
						size="3"
						style={{ minWidth: "260px" }}
						placeholder="Room ID"
						onChange={(event: ChangeEvent<HTMLInputElement>) =>
							setRoomID(event.target.value)
						}
					/>
				)}
				{!joinRoom && (
					<Button size="3" onClick={() => createRoomAndJoin()}>
						Create 1v1 Room
					</Button>
				)}
				<Button
					size="3"
					variant="soft"
					onClick={() => handleJoinRoom()}
				>
					Join 1v1 Room
				</Button>
			</Flex>
		</Box>
	);
}
