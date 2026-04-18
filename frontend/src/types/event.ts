export interface EventLocation {
  _id: string;
  name?: string;
  buildingCode?: string;
  coordinates?: [number, number];
}

export interface TargetAudience {
  majors: string[];
  years: number[];
}

export interface IEvent {
  _id: string;
  title: string;
  description: string;
  category: string;
  organizer: string | any; // Could be expanded to User interface
  club?: string | any;     // Could be expanded to Club interface
  location?: EventLocation | string;
  locationDetails?: string;
  date: string; // ISO date string
  durationMinutes: number;
  capacity?: number;
  rsvpCount: number;
  coverImage?: string;
  tags: string[];
  targetAudience: TargetAudience;
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  organizerId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventFilter {
  category?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  club?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedEventResponse {
  events: IEvent[];
  total: number;
  page: number;
  pages: number;
}

export interface RSVPResponse {
  _id: string;
  user: string;
  event: IEvent;
  status: 'pending' | 'attending' | 'waitlisted' | 'cancelled';
  isCheckedIn: boolean;
  createdAt: string;
}
