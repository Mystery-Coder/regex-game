import { useLocation } from "react-router-dom";
import type { Player, Message, PlayerGuess } from "../types";
import { useEffect, useRef, useState } from "react";
import {
	Box,
	Button,
	IconButton,
	Snackbar,
	TextField,
	Typography,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

function checkValidRegex(regex: string): boolean {
	try {
		new RegExp(regex);
		return true;
	} catch (e) {
		console.log("Not valid regex " + regex);
		return false;
	}
}

export default function RegexGame() {
	const location = useLocation();
	const PlayerData: Player = location.state;

	const wsRef = useRef<WebSocket | null>(null);
	const [status, setStatus] = useState<"WAITING" | "PLAYER2CONNECTED">(
		"WAITING",
	);
	const [stringQuestion, setStringQuestion] = useState<string[]>();
	const [copiedSnackbar, setCopiedSnackbar] = useState(false);
	const [playerGuess, setPlayerGuess] = useState("");

	const guessesStyle = {
		display: "flex",
		flexDirection: "column",
		padding: "130px",
		border: "solid 1px rgba(139, 139, 139, 1)",
		borderRadius: "2px",
		margin: "10px",
	};
	const handleGuess = () => {
		if (playerGuess === "") {
			return;
		}

		if (!checkValidRegex(playerGuess)) {
			return;
		}
		const guessToSend: PlayerGuess = {
			PlayerID: PlayerData.PlayerID,
			Guess: playerGuess,
			Type: "regex",
		};

		wsRef.current?.send(JSON.stringify(guessToSend));
	};

	useEffect(() => {
		if (!PlayerData?.PlayerID || !PlayerData?.RoomID) return;

		const ws = new WebSocket(
			`ws://localhost:8080/connect_player?PlayerID=${PlayerData.PlayerID}&RoomID=${PlayerData.RoomID}`,
		);

		ws.onopen = () => {
			console.log("Connected to WebSocket");
		};

		//Handle the WS messages
		ws.onmessage = (event) => {
			const msg: Message = JSON.parse(event.data);
			console.log(msg);
			switch (msg.Type) {
				case "STATUS": {
					setStatus(msg.Data.Status);

					break;
				}
				case "QUESTION": {
					setStringQuestion(msg.Data.Options);
					break;
				}
			}
		};

		ws.onerror = (err) => {
			console.error(err);
		};

		ws.onclose = () => {
			console.log("WebSocket Close");
		};

		wsRef.current = ws;

		return () => {
			ws.close(); // cleanup when component unmounts
			wsRef.current = null;
		};
	}, [PlayerData]);

	return (
		<div className="center-content-horizontal">
			<Typography variant="h1">RegexGame</Typography>
			{status == "WAITING" && (
				<Typography>
					{PlayerData.RoomID}{" "}
					<IconButton
						onClick={() => {
							navigator.clipboard.writeText(PlayerData.RoomID);
							setCopiedSnackbar(true);
						}}
					>
						<ContentCopyIcon></ContentCopyIcon>
					</IconButton>{" "}
					(share this room ID)
				</Typography>
			)}

			{status == "PLAYER2CONNECTED" && stringQuestion && (
				<>
					<Typography variant="h5">
						Write a RegEx to match all 3 strings,
					</Typography>
					<Typography variant="h4">
						{stringQuestion[0]} {stringQuestion[1]}{" "}
						{stringQuestion[2]}
					</Typography>
					<Box sx={{ display: "flex", flexDirection: "row" }}>
						<Box sx={guessesStyle}>
							<Typography variant="h5">Your Guesses</Typography>
							<TextField
								label="Enter RegEx"
								onChange={(e) => setPlayerGuess(e.target.value)}
							></TextField>
							<Button onClick={() => handleGuess()}>Guess</Button>
							<Box
								sx={{
									display: "flex",
									flexDirection: "column",
									textAlign: "center",
								}}
							>
								dfd
								<br />
								df
							</Box>
						</Box>
						<Box sx={guessesStyle}>
							<Typography variant="h5">
								Opponent's Guesses
							</Typography>
						</Box>
					</Box>
				</>
			)}
			<Snackbar
				anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
				open={copiedSnackbar}
				autoHideDuration={1000}
				onClose={() => setCopiedSnackbar(false)}
				message="Copied RoomID!"
				key={"bottom center"}
			/>
		</div>
	);
}
