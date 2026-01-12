
export enum Language {
  TSWANA = 'Tswana',
  ZULU = 'Zulu'
}

export interface Candidate {
  id: number;
  name: string;
  language: Language;
  votes: number;
  bio: string;
}

export interface User {
  id: string;
  username: string;
  hasVoted: boolean;
  isAdmin: boolean;
}

export interface VoteRecord {
  voterId: string;
  candidateId: number;
  timestamp: number;
}
