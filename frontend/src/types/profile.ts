import { User } from '../features/auth/authSlice';

export interface ISkill {
  _id: string;
  name: string;
  category: string;
}

export interface IBadge {
  _id: string;
  name: string;
  description: string;
  imageUrl: string;
  earnedAt?: string;
}

export interface IProfile extends Omit<User, 'skills' | 'id'> {
  _id: string;
  bio?: string;
  portfolioLinks?: {
    github?: string;
    linkedin?: string;
    website?: string;
  };
  skillsList?: ISkill[]; // Fully populated skills objects from backend
  interests?: string[];
  badges?: IBadge[]; 
  points?: number;
}
