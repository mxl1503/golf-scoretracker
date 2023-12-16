export interface PasswordObject {
  hashedPassword: string;
  salt: string;
}

export interface PlayerTally {
  playerName: string;
  tally: number;
}

export interface HoleScore {
  holePar: number;
  playerScore: number;
}

export interface PlayerHoleScore {
  playerName: string;
  score: HoleScore[];
}

export interface Round {
  course: string;
  players: string[];
  complete: boolean;
  date: Date;
  mensParUsed: boolean;
  scoringFormat: string;
  currentPoints: PlayerTally[];
  currentTotal: PlayerTally[];
  currentPar: PlayerTally[];
  holeScore: PlayerHoleScore[];
}

export interface User {
  userId: number;
  nameFirst: string;
  nameLast: string;
  email: string;
  password: PasswordObject;
  JWT: string;
  previousRounds: Round[];
  currentRound: Round;
}

export interface ParObject {
  mensPar: number;
  womensPar: number;
}

export interface Course {
  name: string;
  description: string;
  totalPar: ParObject;
  totalDistance: number;
  holePars: ParObject[];
  holeDistance: number[];
}
