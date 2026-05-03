import { useLocation } from "react-router-dom";
import type { Player, Message, PlayerGuess } from "../types";
import {
	useEffect,
	useRef,
	useState,
	type ChangeEvent,
	type CSSProperties,
	type KeyboardEvent,
} from "react";
import {
	Box,
	Dialog,
	Flex,
	Heading,
	IconButton,
	Text,
	TextField,
} from "@radix-ui/themes";
import { CopyIcon } from "@radix-ui/react-icons";

const BACKEND = import.meta.env.VITE_BACKEND_URL ?? "http://localhost:8080";
const BACKEND_WS = BACKEND.replace(/^https?:\/\//, (m: string) =>
	m === "https://" ? "wss://" : "ws://",
);

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
	const [winningGuess, setWinningGuess] = useState("");

	const guessesStyle: CSSProperties = {
		display: "flex",
		flexDirection: "column",
		padding: "20px",
		minHeight: "380px",
		minWidth: "400px",
		border: "1px solid var(--gray-a5)",
		borderRadius: "12px",
		background: "var(--color-panel-solid, white)",
		boxShadow: "0 10px 30px rgba(0, 0, 0, 0.06)",
		margin: "10px",
	};
	const toastStyle: CSSProperties = {
		position: "fixed",
		left: "50%",
		transform: "translateX(-50%)",
		padding: "10px 14px",
		borderRadius: "999px",
		boxShadow: "0 12px 30px rgba(0, 0, 0, 0.25)",
		background: "var(--gray-12)",
		color: "white",
		zIndex: 1000,
	};

	useEffect(() => {
		if (!copiedSnackbar) return;
		const timer = window.setTimeout(() => {
			setCopiedSnackbar(false);
		}, 1000);
		return () => window.clearTimeout(timer);
	}, [copiedSnackbar]);

	useEffect(() => {
		if (!invalidRegexSnackbar) return;
		const timer = window.setTimeout(() => {
			setInvalidRegexSnackbar(false);
		}, 1500);
		return () => window.clearTimeout(timer);
	}, [invalidRegexSnackbar]);
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
			`${BACKEND_WS}/connect_player?PlayerID=${PlayerData.PlayerID}&RoomID=${PlayerData.RoomID}`,
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
		<Box
			className="center-content-horizontal"
			style={{ padding: "24px 16px" }}
		>
			<Heading size="8">RegexGame</Heading>
			{status == "WAITING" && (
				<Flex align="center" style={{ gap: "8px" }}>
					<Text size="4" weight="medium">
						{PlayerData.RoomID}
					</Text>
					<IconButton
						variant="ghost"
						color="gray"
						aria-label="Copy room ID"
						onClick={() => {
							navigator.clipboard.writeText(PlayerData.RoomID);
							setCopiedSnackbar(true);
						}}
					>
						<CopyIcon />
					</IconButton>
					<Text size="2" color="gray">
						(share this room ID)
					</Text>
				</Flex>
			)}

			{status == "PLAYER2CONNECTED" && stringQuestion && (
				<>
					<Text size="4" align="center">
						Write a RegEx to match all 3 strings (Press enter to
						guess)
					</Text>
					<Heading size="5" align="center">
						{stringQuestion[0]} {stringQuestion[1]}{" "}
						{stringQuestion[2]}
					</Heading>
					<Flex
						style={{
							gap: "16px",
							flexWrap: "wrap",
							justifyContent: "center",
						}}
					>
						<Box style={guessesStyle}>
							<Text size="4" weight="medium">
								Your Guesses
							</Text>
							<TextField.Root size="3" style={{ width: "100%" }}>
								<TextField.Root
									value={playerGuess}
									onChange={(
										event: ChangeEvent<HTMLInputElement>,
									) => setPlayerGuess(event.target.value)}
									onKeyDown={(
										event: KeyboardEvent<HTMLInputElement>,
									) => {
										if (event.code === "Enter") {
											handleGuess();
										}
									}}
									placeholder="Enter your guess"
									autoFocus
								/>
							</TextField.Root>

							<Box
								style={{
									display: "flex",
									flexDirection: "column",
									textAlign: "center",
									gap: "6px",
								}}
							>
								{playerGuessList.length > 0 &&
									playerGuessList.map((guess, idx) => {
										return (
											<Text key={idx}>{guess.Guess}</Text>
										);
									})}
							</Box>
						</Box>
						<Box style={guessesStyle}>
							<Text size="4" weight="medium">
								Opponent's Guesses
							</Text>
							<Box
								style={{
									display: "flex",
									flexDirection: "column",
									textAlign: "center",
									gap: "6px",
								}}
							>
								{oppositionGuessList.length > 0 &&
									oppositionGuessList.map((guess, idx) => {
										return (
											<Text key={idx}>{guess.Guess}</Text>
										);
									})}
							</Box>
						</Box>
					</Flex>
				</>
			)}

			<Dialog.Root
				open={gameOverDialogOpen}
				onOpenChange={setGameOverDialogOpen}
			>
				<Dialog.Content
					onEscapeKeyDown={(event: Event) => event.preventDefault()}
					onPointerDownOutside={(event: Event) =>
						event.preventDefault()
					}
				>
					<Dialog.Title>
						{winner ? "🎉 You Win!" : "😔 You Lost"}
					</Dialog.Title>
					<Box style={{ marginTop: "8px" }}>
						<Text size="3">
							{winner
								? `Congratulations! You solved it in ${playerGuessList.length} ${playerGuessList.length === 1 ? "guess" : "guesses"}!`
								: `Your opponent solved it first. You made ${playerGuessList.length} ${playerGuessList.length === 1 ? "guess" : "guesses"}.`}
							<br />
							{`Winning guess was ${winningGuess}`}
						</Text>
					</Box>
				</Dialog.Content>
			</Dialog.Root>

			{copiedSnackbar && (
				<Box style={{ ...toastStyle, bottom: "24px" }}>
					<Text size="2" style={{ color: "white" }}>
						Copied RoomID!
					</Text>
				</Box>
			)}
			{invalidRegexSnackbar && (
				<Box
					style={{
						...toastStyle,
						bottom: "64px",
						background: "var(--red-9)",
					}}
				>
					<Text size="2" style={{ color: "white" }}>
						Invalid regex
					</Text>
				</Box>
			)}
		</Box>
	);
}
