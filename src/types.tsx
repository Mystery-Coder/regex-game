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
	Status: string;
}

export interface Message {
	Type: string;
	Data: RoomStatus;
}
