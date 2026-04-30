import { useLocation } from "react-router-dom";
import type { Player, Message, PlayerGuess } from "../types";
import { useEffect, useRef, useState } from "react";
import {
	Box,
	Dialog,
	DialogContent,
	DialogTitle,
	IconButton,
	Snackbar,
	TextField,
	Typography,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

export default function StringGame() {
	const location = useLocation();
	const PlayerData: Player = location.state;

	const wsRef = useRef<WebSocket | null>(null);
	const [status, setStatus] = useState<"WAITING" | "PLAYER2CONNECTED">(
		"WAITING",
	);
	const [regexQuestion, setRegexQuestion] = useState<string>();
	const [copiedSnackbar, setCopiedSnackbar] = useState(false);

	const [playerGuess, setPlayerGuess] = useState("");

	const [playerGuessList, setPlayerGuessList] = useState<PlayerGuess[]>([]);
	const [oppositionGuessList, setOppositionGuessList] = useState<
		PlayerGuess[]
	>([]);
	const [winner, setWinner] = useState(false);
	const [gameOverDialogOpen, setGameOverDialogOpen] = useState(false);
	const [winningGuess, setWinningGuess] = useState("");

	const guessesStyle = {
		display: "flex",
		flexDirection: "column",
		padding: "20px",
		minHeight: "380px",
		minWidth: "400px",
		border: "solid 1px rgba(139, 139, 139, 1)",
		borderRadius: "2px",
		margin: "10px",
	};
	const handleGuess = () => {
		if (playerGuess === "") {
			return;
		}

		const guessToSend: PlayerGuess = {
			PlayerID: PlayerData.PlayerID,
			Guess: playerGuess,
			Type: "string",
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
				setRegexQuestion(msg.Data.Pattern);
				break;
			}
			case "PLAYERGUESS": {
				if (msg.Data.Type === "string") {
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
				if (msg.Data.Type === "string") {
					if (msg.Data.PlayerID === PlayerData.PlayerID) {
						setWinner(true);
					}
					setGameOverDialogOpen(true);
					setWinningGuess(msg.Data.Guess);
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
			<Typography variant="h1">StringGame</Typography>
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

			{status == "PLAYER2CONNECTED" && regexQuestion && (
				<>
					<Typography variant="h5">
						Give a string to match the Regular Expression (Press
						enter to guess)
					</Typography>
					<Typography variant="h4">{regexQuestion}</Typography>
					<Box sx={{ display: "flex", flexDirection: "row" }}>
						<Box sx={guessesStyle}>
							<Typography variant="h5">Your Guesses</Typography>
							<TextField
								// label="Enter RegEx"
								value={playerGuess}
								onChange={(e) => setPlayerGuess(e.target.value)}
								onKeyDown={(e) => {
									if (e.code === "Enter") {
										handleGuess();
									}
								}}
								placeholder="Enter your guess"
								autoFocus
							></TextField>

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
												{guess.Guess}
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
						<br />
						{`Winning guess was ${winningGuess}`}
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
		</div>
	);
}
