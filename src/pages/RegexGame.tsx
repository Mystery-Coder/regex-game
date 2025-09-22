import { useLocation } from "react-router-dom";
import type { Player, Message } from "../types";
import { useEffect, useRef, useState } from "react";

export default function RegexGame() {
	const location = useLocation();
	const PlayerData: Player = location.state;
	const wsRef = useRef<WebSocket | null>(null);
	const [noOfPlayers, setNoOfPlayers] = useState(1);

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
					console.log(msg.Data.Status);

					if (msg.Data.Status === "PLAYER2CONNECTED") {
						setNoOfPlayers((prev) => prev + 1);
					}
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
		<div>
			RegexGame - {noOfPlayers} in the room {PlayerData.RoomID} (share
			this room ID)
		</div>
	);
}
