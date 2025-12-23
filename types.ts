
export interface PlatformData {
  id: string;
  position: [number, number, number];
  size: [number, number, number];
  color: string;
}

export enum GameState {
  START = 'START',
  PLAYING = 'PLAYING',
  GAMEOVER = 'GAMEOVER',
  LOADING = 'LOADING'
}

export interface GameStats {
  score: number;
  highestPlatform: number;
  aiComment: string;
}
