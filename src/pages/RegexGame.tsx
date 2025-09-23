import { useLocation } from "react-router-dom";
import type { Player, Message } from "../types";
import { useEffect, useRef, useState } from "react";
import { IconButton, Snackbar, Typography } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
export default function RegexGame() {
	const location = useLocation();
	const PlayerData: Player = location.state;
	const wsRef = useRef<WebSocket | null>(null);
	const [status, setStatus] = useState<"WAITING" | "PLAYER2CONNECTED">(
		"WAITING"
	);
	const [copiedSnackbar, setCopiedSnackbar] = useState(false);

	useEffect(() => {
		if (!PlayerData?.PlayerID || !PlayerData?.RoomID) return;

		const ws = new WebSocket(
			`ws://localhost:8080/connect_player?PlayerID=${PlayerData.PlayerID}&RoomID=${PlayerData.RoomID}`
		);

		ws.onopen = () => {
			console.log("Connected to WebSocket");
		};

		ws.onmessage = (event) => {
			const msg: Message = JSON.parse(event.data);
			console.log(msg);
			switch (msg.Type) {
				case "STATUS": {
					setStatus(msg.Data.Status);
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

			<Typography>Current Status: {status}</Typography>

			<Snackbar
				anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
				open={copiedSnackbar}
				autoHideDuration={1000}
				onClose={() => setCopiedSnackbar(false)}
				message="Copied"
				key={"bottom center"}
			/>
		</div>
	);
}
