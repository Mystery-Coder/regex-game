import { useLocation } from "react-router-dom";
import type { Player } from "../types";
import { useEffect, useRef } from "react";

export default function RegexGame() {
	const location = useLocation();
	const PlayerData: Player = location.state;
	const wsRef = useRef<WebSocket | null>(null);

	useEffect(() => {
		if (!PlayerData?.PlayerID || !PlayerData?.RoomID) return;

		const ws = new WebSocket(
			`ws://localhost:8080/connect_player?PlayerID=${PlayerData.PlayerID}&RoomID=${PlayerData.RoomID}`
		);

		ws.onopen = () => {
			console.log("✅ Connected to WebSocket");
		};

		ws.onmessage = (event) => {
			console.log(event.data);
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

	return <div>RegexGame</div>;
}
