
import { User, Candidate, VoteRecord, Language } from '../types';
import { STORAGE_KEYS, INITIAL_CANDIDATES } from '../constants';

export const storageService = {
  init() {
    if (!localStorage.getItem(STORAGE_KEYS.CANDIDATES)) {
      localStorage.setItem(STORAGE_KEYS.CANDIDATES, JSON.stringify(INITIAL_CANDIDATES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([]));
    }
  },

  getUsers(): User[] {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    return data ? JSON.parse(data) : [];
  },

  getCandidates(): Candidate[] {
    const data = localStorage.getItem(STORAGE_KEYS.CANDIDATES);
    return data ? JSON.parse(data) : INITIAL_CANDIDATES;
  },

  saveUser(user: User) {
    const users = this.getUsers();
    const existingIndex = users.findIndex(u => u.id === user.id);
    if (existingIndex >= 0) {
      users[existingIndex] = user;
    } else {
      users.push(user);
    }
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  castVote(userId: string, candidateId: number): boolean {
    const users = this.getUsers();
    const user = users.find(u => u.id === userId);
    if (!user || user.hasVoted) return false;

    const candidates = this.getCandidates();
    const candidate = candidates.find(c => c.id === candidateId);
    if (!candidate) return false;

    candidate.votes += 1;
    user.hasVoted = true;

    localStorage.setItem(STORAGE_KEYS.CANDIDATES, JSON.stringify(candidates));
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    
    // Update session user too
    const sessionUser = this.getCurrentUser();
    if (sessionUser && sessionUser.id === userId) {
        sessionUser.hasVoted = true;
        this.setCurrentUser(sessionUser);
    }

    return true;
  },

  // Admin Actions
  resetVotes() {
    const candidates = this.getCandidates().map(c => ({ ...c, votes: 0 }));
    const users = this.getUsers().map(u => ({ ...u, hasVoted: false }));
    localStorage.setItem(STORAGE_KEYS.CANDIDATES, JSON.stringify(candidates));
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    
    const currentUser = this.getCurrentUser();
    if (currentUser) {
      currentUser.hasVoted = false;
      this.setCurrentUser(currentUser);
    }
  },

  clearUsers() {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([]));
  },

  addCandidate(name: string, language: Language, bio: string) {
    const candidates = this.getCandidates();
    const newCandidate: Candidate = {
      id: Date.now(),
      name,
      language,
      votes: 0,
      bio
    };
    candidates.push(newCandidate);
    localStorage.setItem(STORAGE_KEYS.CANDIDATES, JSON.stringify(candidates));
  },

  deleteCandidate(id: number) {
    const candidates = this.getCandidates().filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.CANDIDATES, JSON.stringify(candidates));
  },

  setCurrentUser(user: User | null) {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  },

  getCurrentUser(): User | null {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  }
};
