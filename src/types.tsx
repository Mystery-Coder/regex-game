export interface CreateRoomRes {
	RoomID: string;
}

export interface AddPlayerRes {
	PlayerID: string;
}

export interface Player {
	PlayerID: string;
	RoomID: string;
}

export interface RoomStatus {
	Status: "WAITING" | "PLAYER2CONNECTED";
}

export interface Message {
	Type: string;
	Data: RoomStatus;
}
