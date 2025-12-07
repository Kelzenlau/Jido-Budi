import { User as FirebaseUser } from 'firebase/auth';
import { Timestamp } from 'firebase/firestore';

export interface AppUser extends Partial<FirebaseUser> {
  role?: 'user' | 'admin';
  name?: string;
  email?: string | null;
  photoURL?: string | null;
  joinedAt?: any; // Firestore Timestamp
}

export interface Voucher {
  id?: string;
  code: string;
  uid: string;
  email: string;
  name: string;
  score: number;
  sentAt: any;
  status: 'active' | 'redeemed' | 'expired';
  gameType: string;
  reward?: string;
}

export interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
}

export interface GameConfig {
  winScore: number;
  timeLimit: number;
  voucherProbability: number;
  theme: 'default' | 'fruits' | 'sports' | 'animals';
}

export interface HomeConfig {
  title: string;
  subtitle: string;
  mediaType: 'image' | 'video';
  mediaUrl: string;
}

export interface AnnouncementConfig {
  text: string;
  active: boolean;
  color: string;
}

export interface LeaderboardEntry {
  id?: string;
  name: string;
  score: number;
  photoURL?: string;
  updatedAt?: any;
}

export enum GameType {
  MATCH3 = 'match3',
  SWIPE = 'swipe'
}