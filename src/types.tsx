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

// Data interfaces
export interface RoomStatus {
	Status: "WAITING" | "PLAYER2CONNECTED";
}

export interface Question {
	QuestionType: string;
	Pattern: string;
	Options: string[];
}
export interface PlayerGuess {
	PlayerID: string;
	Guess: string;
	Type: string;
}

//Message Interfaces
export interface StatusMessage {
	Type: "STATUS";
	Data: RoomStatus;
}

export interface QuestionMessage {
	Type: "QUESTION";
	Data: Question;
}

export interface GuessMessage {
	Type: "PLAYERGUESS";
	Data: PlayerGuess;
}

export type Message = StatusMessage | QuestionMessage | GuessMessage;
