import { useLocation } from "react-router-dom";
import type { Player, Message, PlayerGuess } from "../types";
import { useEffect, useRef, useState } from "react";
import {
	Box,
	Button,
	Dialog,
	DialogContent,
	DialogTitle,
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
	const [invalidRegexSnackbar, setInvalidRegexSnackbar] = useState(false);
	const [playerGuess, setPlayerGuess] = useState("");

	const [playerGuessList, setPlayerGuessList] = useState<PlayerGuess[]>([]);
	const [oppositionGuessList, setOppositionGuessList] = useState<
		PlayerGuess[]
	>([]);
	const [winner, setWinner] = useState(false);
	const [gameOverDialogOpen, setGameOverDialogOpen] = useState(false);

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
			setInvalidRegexSnackbar(true);
			return;
		}
		const guessToSend: PlayerGuess = {
			PlayerID: PlayerData.PlayerID,
			Guess: playerGuess,
			Type: "regex",
		};

		wsRef.current?.send(JSON.stringify(guessToSend));
		setPlayerGuess("");
	};

	const handleWSEvents = (msg: Message) => {
		switch (msg.Type) {
			case "STATUS": {
				setStatus(msg.Data.Status);
				break;
			}
			case "QUESTION": {
				setStringQuestion(msg.Data.Options);
				break;
			}
			case "PLAYERGUESS": {
				if (msg.Data.Type === "regex") {
					//Just safety check, has to be regex
					if (msg.Data.PlayerID === PlayerData.PlayerID) {
						setPlayerGuessList((prev) => [...prev, msg.Data]);
					} else {
						setOppositionGuessList((prev) => [...prev, msg.Data]);
					}
				}
				break;
			}
			case "WINNIGGUESS": {
				if (msg.Data.Type === "regex") {
					if (msg.Data.PlayerID === PlayerData.PlayerID) {
						setWinner(true);
						setGameOverDialogOpen(true);
					} else {
						setGameOverDialogOpen(true);
					}
				}
			}
		}
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
			let msg: Message;
			try {
				msg = JSON.parse(event.data);
				console.log(msg);
				handleWSEvents(msg);
			} catch (e) {
				console.log(e);
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
								value={playerGuess}
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
								{playerGuessList.length > 0 &&
									playerGuessList.map((guess, idx) => {
										return (
											<Typography key={idx}>
												{guess.Guess}
											</Typography>
										);
									})}
							</Box>
						</Box>
						<Box sx={guessesStyle}>
							<Typography variant="h5">
								Opponent's Guesses
							</Typography>
							<Box
								sx={{
									display: "flex",
									flexDirection: "column",
									textAlign: "center",
								}}
							>
								{oppositionGuessList.length > 0 &&
									oppositionGuessList.map((guess, idx) => {
										return (
											<Typography key={idx}>
												{guess.Guess}❌
											</Typography>
										);
									})}
							</Box>
						</Box>
					</Box>
				</>
			)}

			<Dialog open={gameOverDialogOpen} disableEscapeKeyDown>
				<DialogTitle>
					{winner ? "🎉 You Win!" : "😔 You Lost"}
				</DialogTitle>
				<DialogContent>
					<Typography variant="body1">
						{winner
							? `Congratulations! You solved it in ${playerGuessList.length} ${playerGuessList.length === 1 ? "guess" : "guesses"}!`
							: `Your opponent solved it first. You made ${playerGuessList.length} ${playerGuessList.length === 1 ? "guess" : "guesses"}.`}
					</Typography>
				</DialogContent>
			</Dialog>

			<Snackbar
				anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
				open={copiedSnackbar}
				autoHideDuration={1000}
				onClose={() => setCopiedSnackbar(false)}
				message="Copied RoomID!"
				key={"bottom center"}
			/>
			<Snackbar
				anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
				open={invalidRegexSnackbar}
				autoHideDuration={1500}
				onClose={() => setInvalidRegexSnackbar(false)}
				message="Invalid regex"
				key={"invalid regex"}
			/>
		</div>
	);
}
