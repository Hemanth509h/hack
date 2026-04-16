export interface SocialLinks {
  website?: string;
  instagram?: string;
  discord?: string;
}

export interface IClub {
  _id: string;
  name: string;
  description: string;
  category: string;
  logo?: string;
  coverImage?: string;
  status: 'pending' | 'active' | 'inactive';
  socialLinks?: SocialLinks;
  meetingSchedule?: string;
  tags: string[];
  memberCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface IClubMember {
  _id: string;
  user: {
    _id: string;
    name: string;
    avatar?: string;
    major?: string;
  };
  club: string;
  role: 'member' | 'board' | 'president';
  status: 'pending' | 'approved' | 'rejected';
  engagementScore: number;
  createdAt: string;
}

export interface ClubFilter {
  search?: string;
  category?: string;
  sortBy?: 'active' | 'new' | 'popular';
  page?: number;
  limit?: number;
}

export interface PaginatedClubResponse {
  clubs: IClub[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
}

export interface FeaturedClubsResponse {
  featured: IClub[];
}

export interface ClubDetailResponse {
  club: IClub;
  leadership: IClubMember[];
}

export interface ClubMembersResponse {
  members: IClubMember[];
}

export interface ClubAnalytics {
  metrics: {
    memberships: { _id: string; count: number }[];
    events: { _id: string; totalEvents: number; totalRSVPsGained: number }[];
  };
}
