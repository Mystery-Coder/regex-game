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
