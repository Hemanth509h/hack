# The Quad - Complete Implementation Prompts Guide

**Project:** The Quad - College Event & Club Hub Platform  
**Tech Stack:** React.js, Express.js, MongoDB  
**Document Purpose:** Step-by-step prompts to guide development from setup to deployment

---

## Table of Contents

1. [Project Setup & Infrastructure](#phase-1-project-setup--infrastructure)
2. [Backend Development](#phase-2-backend-development)
3. [Frontend Development](#phase-3-frontend-development)
4. [Feature Implementation](#phase-4-feature-implementation)
5. [Integration & Testing](#phase-5-integration--testing)
6. [Deployment & DevOps](#phase-6-deployment--devops)

---

# PHASE 1: Project Setup & Infrastructure

## Prompt 1.1: Initialize Project Structure

```
Create a full-stack MERN project structure for "The Quad" - a college event and club management platform. 

Requirements:
- Monorepo structure with separate frontend and backend folders
- Backend: Express.js with TypeScript support, proper folder organization (routes, controllers, models, middleware, utils, config)
- Frontend: React.js with Vite, TypeScript, and Tailwind CSS
- Environment configuration files (.env.example)
- Package.json files with all necessary dependencies
- ESLint and Prettier configuration
- Git setup with proper .gitignore files
- Docker configuration for development environment
- README.md with project overview and setup instructions

Generate the complete folder structure and all configuration files.
```

---

## Prompt 1.2: Database Setup & Configuration

```
Set up MongoDB database configuration for The Quad platform.

Requirements:
- MongoDB connection setup using Mongoose in Express backend
- Connection pooling configuration for production
- Database configuration for development, staging, and production environments
- Error handling for database connection failures
- Graceful shutdown handling
- Environment variables for database credentials
- Database naming convention and best practices

Create:
1. Database configuration file (config/database.js or database.ts)
2. Connection initialization code
3. Environment variable template
4. Documentation for local MongoDB setup and MongoDB Atlas setup
```

---

## Prompt 1.3: Authentication System Architecture

```
Design and implement a complete authentication system for The Quad platform.

Requirements:
- JWT-based authentication with access and refresh tokens
- Passport.js integration for local strategy
- OAuth 2.0 setup for Google and Microsoft SSO
- Password hashing with bcrypt
- Role-based access control (student, club_leader, admin)
- Session management with Redis
- Password reset functionality
- Email verification for new accounts
- Rate limiting for auth endpoints

Provide:
1. Authentication middleware
2. Auth routes and controllers
3. User model with authentication fields
4. JWT utility functions (generate, verify, refresh)
5. Passport strategies configuration
6. Auth error handling
```

---

# PHASE 2: Backend Development

## Prompt 2.1: Core Data Models (Mongoose Schemas)

```
Create complete Mongoose schemas for The Quad platform based on the PRD.

Required Schemas:
1. User Schema - with skills, interests, notification preferences, OAuth fields
2. Event Schema - with location (GeoJSON), RSVP counts, tags, target audience
3. RSVP Schema - with check-in tracking
4. Club Schema - with leaders, meeting schedule, social links
5. ClubMembership Schema - with roles and engagement tracking
6. Skill Schema - reference data with categories
7. TeamProject Schema - with required skills and pending requests
8. Notification Schema - with delivery tracking and TTL
9. Location Schema - with GeoJSON coordinates for map features

For each schema:
- Include all fields with proper types and validation
- Add indexes for performance (compound, text, geospatial, TTL)
- Include Mongoose hooks for denormalization (pre/post save)
- Add instance methods and static methods as needed
- Include proper TypeScript interfaces
- Add schema documentation
```

---

## Prompt 2.2: Event Management API

```
Build a complete RESTful API for event management in The Quad platform.

Endpoints to implement:
- GET /api/v1/events - List events with filtering, pagination, search
- POST /api/v1/events - Create new event (auth required, club leader+)
- GET /api/v1/events/:id - Get event details
- PUT /api/v1/events/:id - Update event (auth, ownership check)
- DELETE /api/v1/events/:id - Delete event (auth, ownership check)
- POST /api/v1/events/:id/rsvp - RSVP to event
- DELETE /api/v1/events/:id/rsvp - Cancel RSVP
- GET /api/v1/events/:id/attendees - List attendees (auth)
- POST /api/v1/events/:id/checkin - QR code check-in
- GET /api/v1/events/recommendations - Personalized recommendations
- GET /api/v1/events/nearby - Location-based discovery

Include:
- Request validation (Joi/Express-validator)
- Authorization middleware
- Error handling
- Pagination utilities
- Search and filter logic
- Response formatting
- API documentation (JSDoc or Swagger)
```

---

## Prompt 2.3: Club Management API

```
Implement the complete Club management API for The Quad platform.

Endpoints:
- GET /api/v1/clubs - List all clubs with filters
- POST /api/v1/clubs - Create new club (requires admin approval)
- GET /api/v1/clubs/:id - Get club details with member count
- PUT /api/v1/clubs/:id - Update club (auth, leader only)
- DELETE /api/v1/clubs/:id - Deactivate club (auth, admin)
- POST /api/v1/clubs/:id/join - Request to join club
- DELETE /api/v1/clubs/:id/leave - Leave club
- GET /api/v1/clubs/:id/members - List members with roles
- PUT /api/v1/clubs/:id/members/:userId/role - Update member role (leader only)
- POST /api/v1/clubs/:id/announcements - Send announcement (leader only)
- GET /api/v1/clubs/:id/analytics - Club engagement analytics
- GET /api/v1/clubs/featured - Get featured clubs

Include:
- Membership approval workflow
- Role-based access checks
- Analytics aggregation pipeline
- Featured clubs logic
- Full-text search on club name/description
```

---

## Prompt 2.4: User Profile & Skills API

```
Create User Profile and Skills management APIs.

User Profile Endpoints:
- GET /api/v1/users/:id/profile - Get public profile
- PUT /api/v1/users/:id/profile - Update own profile
- POST /api/v1/users/:id/skills - Add skills to profile
- DELETE /api/v1/users/:id/skills/:skillId - Remove skill
- PUT /api/v1/users/:id/interests - Update interests array
- GET /api/v1/users/:id/events - User's RSVP'd events
- GET /api/v1/users/:id/clubs - User's club memberships
- POST /api/v1/users/:id/avatar - Upload profile picture
- GET /api/v1/users/:id/portfolio - Get portfolio data

Skills Management:
- GET /api/v1/skills - List all skills
- GET /api/v1/skills/search?q=react - Autocomplete search
- POST /api/v1/skills - Create new skill (admin/auto-create)
- GET /api/v1/skills/categories - Get skill categories

Include:
- Image upload with Multer + Sharp (resize, optimize)
- S3/Cloudinary integration for storage
- Privacy settings enforcement
- Skill validation and deduplication
```

---

## Prompt 2.5: Team Matching Algorithm & API

```
Implement the AI-powered team matching system for The Quad.

Requirements:
1. Team Matching Algorithm:
   - Calculate compatibility score (0-100%) between users
   - Factors: Skill overlap, interests alignment, past collaboration success, availability
   - Use cosine similarity on skill embeddings (OpenAI or local embeddings)
   - Collaborative filtering based on past successful matches

2. API Endpoints:
   - GET /api/v1/teams/matches - Get top matches for current user
   - POST /api/v1/teams/projects - Create team project
   - GET /api/v1/teams/projects/:id - Get project details
   - PUT /api/v1/teams/projects/:id - Update project
   - DELETE /api/v1/teams/projects/:id - Delete project
   - POST /api/v1/teams/projects/:id/request - Request to join
   - PUT /api/v1/teams/requests/:id/accept - Accept team request
   - PUT /api/v1/teams/requests/:id/decline - Decline request
   - GET /api/v1/teams/my-projects - User's projects
   - GET /api/v1/teams/browse - Browse all open projects

3. Implementation:
   - Matching algorithm with adjustable weights
   - Caching of match results (Redis)
   - Batch processing for recommendation generation
   - Feedback loop to improve matches over time
```

---

## Prompt 2.6: Notification System

```
Build a comprehensive notification system with multi-channel delivery.

Components:
1. Notification Service:
   - Create notification records in MongoDB
   - Queue notifications for delivery (Bull/BullMQ)
   - Multi-channel delivery: Push, Email, In-App
   - Template system for different notification types
   - User preference checking before sending

2. Push Notification Setup:
   - Firebase Cloud Messaging integration
   - Device token management
   - Send push notifications with action deep links
   - Handle delivery failures

3. Email Notifications:
   - SendGrid/Nodemailer setup
   - HTML email templates (Handlebars/EJS)
   - Event reminders, club announcements, team requests
   - Unsubscribe link handling

4. API Endpoints:
   - GET /api/v1/notifications - List user notifications (paginated)
   - PUT /api/v1/notifications/:id/read - Mark as read
   - PUT /api/v1/notifications/read-all - Mark all as read
   - POST /api/v1/notifications/preferences - Update preferences
   - GET /api/v1/notifications/preferences - Get preferences
   - POST /api/v1/notifications/test - Test notification (dev only)

5. Real-time Delivery:
   - Socket.io integration for instant in-app notifications
   - Event emitters for notification triggers
```

---

## Prompt 2.7: Real-Time Features with Socket.io

```
Implement real-time features using Socket.io for The Quad platform.

Features:
1. Live Event Updates:
   - RSVP count changes in real-time
   - Event status changes (live, completed, cancelled)
   - New events matching user interests

2. Real-Time Notifications:
   - Instant notification delivery to connected clients
   - Notification badge counter updates
   - Team request notifications

3. Live Chat (Basic):
   - Team project discussion channels
   - Club announcement broadcasts
   - Message history retrieval

Implementation Requirements:
- Socket.io server setup with Express
- Authentication middleware for socket connections (JWT)
- Room-based architecture (event rooms, club rooms, project rooms)
- Event emitters and listeners
- Connection state management
- Reconnection handling
- Rate limiting for socket events
- Redis adapter for horizontal scaling

Provide:
- Socket.io server configuration
- Client connection utilities
- Event handlers for each feature
- Authentication flow
- Error handling
```

---

## Prompt 2.8: Search & Discovery APIs

```
Implement advanced search and discovery features.

1. Event Search:
   - Full-text search on title, description, tags
   - Filter by: category, date range, location, organizer, club
   - Sort by: date, relevance, popularity (RSVP count)
   - Autocomplete suggestions
   - Recent searches tracking

2. Club Search:
   - Full-text search on name, description
   - Filter by: category, size, activity level, tags
   - Featured clubs prioritization

3. Geospatial Search:
   - Find events within radius of user location
   - Building/location search on campus map
   - Nearby events endpoint

4. Recommendation Engine:
   - Content-based recommendations (similar events/clubs)
   - Collaborative filtering (users like you also liked)
   - Trending events/clubs

Implementation:
- MongoDB text indexes and aggregation pipelines
- Optional: Elasticsearch integration for advanced search
- Caching layer for popular searches
- Search analytics tracking

API Endpoints:
- GET /api/v1/search?q=hackathon&type=events
- GET /api/v1/search/autocomplete?q=code
- GET /api/v1/search/nearby?lat=&lng=&radius=
- GET /api/v1/recommendations/events
- GET /api/v1/recommendations/clubs
- GET /api/v1/trending/events
```

---

## Prompt 2.9: Admin Dashboard API

```
Create comprehensive admin APIs for The Quad platform.

Analytics Endpoints:
- GET /api/v1/admin/dashboard - Overview metrics (active students, upcoming events, pending clubs, system health)
- GET /api/v1/admin/analytics/engagement - Student engagement trends (daily RSVP volume, active users over time)
- GET /api/v1/admin/analytics/events - Event statistics (by category, attendance rates)
- GET /api/v1/admin/analytics/clubs - Club statistics (growth, engagement)
- GET /api/v1/admin/analytics/demographics - User demographics breakdown
- POST /api/v1/admin/reports/engagement - Generate and download engagement report

User Management:
- GET /api/v1/admin/users - List all users with filters
- GET /api/v1/admin/users/recent - Recently active users
- PUT /api/v1/admin/users/:id/role - Update user role
- PUT /api/v1/admin/users/:id/status - Activate/deactivate user
- DELETE /api/v1/admin/users/:id - Delete user account

Club Approval Workflow:
- GET /api/v1/admin/clubs/pending - Pending club applications
- PUT /api/v1/admin/clubs/:id/approve - Approve club
- PUT /api/v1/admin/clubs/:id/reject - Reject club with reason
- GET /api/v1/admin/clubs/:id/details - Full club application details

System Management:
- POST /api/v1/admin/announcements - Send system-wide announcement
- GET /api/v1/admin/system/health - System health check
- GET /api/v1/admin/audit-logs - Audit trail of admin actions
- POST /api/v1/admin/cache/clear - Clear Redis cache

Include:
- Admin-only middleware
- Comprehensive logging of admin actions
- MongoDB aggregation pipelines for analytics
- Export functionality (CSV, PDF)
- Audit trail system
```

---

## Prompt 2.10: AI Chatbot Integration (Nexus)

```
Implement the Nexus AI chatbot backend integration.

Requirements:
1. OpenAI GPT-4 Integration:
   - Chat completion API calls
   - Conversation context management
   - System prompts for campus knowledge
   - Function calling for data retrieval

2. Knowledge Base:
   - Event information retrieval
   - Club directory search
   - Location/building information
   - Dining hours, academic calendar
   - FAQ responses

3. Conversational Features:
   - Multi-turn conversation support
   - Context retention (last 10 messages)
   - Intent classification
   - Entity extraction (dates, locations, event names)
   - Suggested follow-up questions

4. API Endpoints:
   - POST /api/v1/ai/chat - Send message to chatbot
   - GET /api/v1/ai/chat/history - Get conversation history
   - DELETE /api/v1/ai/chat/history - Clear conversation
   - POST /api/v1/ai/chat/feedback - Rate chatbot response

5. Function Calling:
   - Define functions for: searchEvents, getEventDetails, findClubs, getLocationInfo, getDiningHours
   - Execute functions based on user intent
   - Format results for natural language response

6. Optimizations:
   - Response streaming for real-time typing effect
   - Caching common queries
   - Fallback to web search for unknown queries
   - Error handling and graceful degradation

Include:
- OpenAI API wrapper utilities
- Conversation state management
- Function definitions and handlers
- Prompt engineering for campus context
- Rate limiting and cost management
```

---

# PHASE 3: Frontend Development

## Prompt 3.1: React Project Setup & Architecture

```
Set up the React frontend for The Quad platform with modern best practices.

Requirements:
1. Project Structure:
   - Feature-based folder organization (features/auth, features/events, features/clubs, etc.)
   - Shared components library (components/ui)
   - Custom hooks directory (hooks/)
   - Utilities and helpers (utils/)
   - API client setup (services/api.js)
   - Type definitions (types/)

2. State Management:
   - Redux Toolkit setup with slices for: auth, events, clubs, teams, notifications, user
   - RTK Query for API calls and caching
   - Redux DevTools configuration

3. Routing:
   - React Router v6 setup
   - Protected routes (require authentication)
   - Role-based route guards
   - Route definitions for all pages

4. UI Framework:
   - Tailwind CSS configuration matching The Quad design system
   - Custom color palette from PRD
   - Typography settings
   - Component variants

5. Developer Experience:
   - Hot module replacement
   - Error boundaries
   - Loading states
   - Dev environment proxy to backend

Create the complete project structure and configuration files.
```

---

## Prompt 3.2: Design System & Component Library

```
Build a comprehensive React component library matching The Quad's design system.

Components to Create:

1. Layout Components:
   - Sidebar navigation with icons and active states
   - TopBar with search, notifications bell, profile menu
   - PageContainer with consistent padding and max-width
   - Card component with variants (event card, club card, team match card)

2. Form Components:
   - Input fields with validation states
   - Textarea with character counter
   - Select dropdowns (custom styled)
   - Checkbox and Radio buttons
   - DateTimePicker for event creation
   - ImageUpload with preview and crop
   - SkillSelector with autocomplete

3. Button Components:
   - Primary, Secondary, Tertiary variants
   - Icon buttons (circular, minimal)
   - Button with loading spinner
   - Button groups

4. Feedback Components:
   - Toast notifications (success, error, info, warning)
   - Modal/Dialog with backdrop
   - Alert banners
   - Loading skeletons
   - Empty states
   - Error states

5. Data Display:
   - Badge components (status, category, skill tags)
   - Avatar with fallback initials
   - Event card with image, metadata, RSVP button
   - Club card with logo, member count, join button
   - Team match card with profile, skills, match percentage
   - Stat cards for dashboard

6. Navigation:
   - Tabs component
   - Breadcrumbs
   - Pagination
   - Filter chips

Requirements:
- TypeScript interfaces for all props
- Tailwind CSS for styling (matching PRD color palette)
- Accessibility (ARIA labels, keyboard navigation)
- Responsive design for mobile, tablet, desktop
- Storybook documentation (optional but recommended)
- Unit tests with React Testing Library
```

---

## Prompt 3.3: Authentication Flow (Login, Register, SSO)

```
Implement complete authentication flow in React.

Pages & Components:
1. Login Page:
   - Email/password form
   - "Forgot Password" link
   - SSO buttons (Google, Microsoft)
   - "Remember Me" checkbox
   - Error handling
   - Redirect to dashboard on success

2. Registration Page:
   - Multi-step form (Account Info → Profile → Interests)
   - Email, password, name, major, year
   - Skills selection
   - Interests selection
   - Email verification notice
   - Terms of service checkbox

3. Password Reset Flow:
   - Request reset email page
   - Reset password page (with token validation)
   - Success confirmation

4. OAuth Callback Handler:
   - Handle SSO redirects
   - Token exchange
   - Profile completion if needed

State Management:
- Redux slice for auth state (user, token, isAuthenticated)
- RTK Query mutations for: login, register, logout, refreshToken
- Persist auth state in localStorage/sessionStorage
- Auto-refresh token before expiry

Protected Route Component:
- Check authentication status
- Redirect to login if not authenticated
- Role-based access control
- Loading state while checking auth

API Integration:
- Axios interceptor for adding JWT to requests
- Token refresh logic on 401 responses
- Error handling for network issues
```

---

## Prompt 3.4: Event Discovery & Detail Pages

```
Build the Event Discovery and Event Detail pages.

1. Events List Page (/events):
   - Hero section: "Happening In The Quad"
   - Filter bar: All Events, Workshops, Hackathons, Cultural, Sports, Career
   - Event grid with event cards (image, title, date, location, RSVP count)
   - "AI Recommended" badge on personalized suggestions
   - Infinite scroll or pagination
   - Search bar at top
   - "Happening Now" live events section
   - Empty state when no events found

2. Event Detail Page (/events/:id):
   - Full-width cover image
   - Event title and description
   - Metadata: Date/time, location (with map link), organizer, club
   - RSVP button with current count
   - Calendar integration buttons (Google, Apple, Outlook)
   - Attendee avatars (first 10, then "+X more")
   - Related events section
   - Share buttons (social media, copy link)
   - QR code for check-in (if user RSVP'd)

3. Event Creation Form (/events/create):
   - Multi-step wizard: Basic Info → Details → Publish
   - Fields: Title, Description, Category, Date/Time, Location, Cover Image, Capacity
   - Draft save functionality
   - Preview before publishing
   - Target audience selection (optional: majors, years, specific clubs)
   - Visibility settings (public/private)

4. My Events Page (/events/my-rsvps):
   - Tabs: Upcoming, Past, Cancelled
   - Event cards with check-in status
   - Quick actions: View, Cancel RSVP, Add to Calendar
   - Empty states for each tab

State Management:
- Redux slice for events (list, selected event, filters)
- RTK Query for: fetchEvents, fetchEventById, createEvent, rsvpEvent, cancelRsvp
- Optimistic updates for RSVP actions
- Caching strategy

Components Needed:
- EventCard, EventFilters, EventDetail, EventForm, RSVPButton, AttendeeList
```

---

## Prompt 3.5: Club Discovery & Management Pages

```
Create Club-related pages for The Quad frontend.

1. Clubs Directory Page (/clubs):
   - Hero: "Discover Your Tribe"
   - Featured clubs carousel (Club of the Month badge)
   - Filter chips: All Interests, Tech, Arts, Debate, Volley, Music, Sports
   - Sort dropdown: Active, New, Popular
   - Club grid with club cards (logo, name, member count, category)
   - Search bar
   - Join button on each card (one-tap action)

2. Club Detail Page (/clubs/:id):
   - Cover image and logo
   - Club name, description, category
   - Member count and "Join Club" button
   - Leadership section (President, Board Members)
   - Meeting schedule information
   - Upcoming events section (club-hosted)
   - Recent announcements
   - Member grid (with roles)
   - Social links (website, Instagram, Discord, etc.)

3. Club Dashboard (for Club Leaders) (/clubs/:id/dashboard):
   - Stats cards: Total Members, RSVPs for Next Event, Engagement Rate, Pending Requests
   - Upcoming events list with edit/cancel actions
   - Recent joins section
   - "Create New Event" button
   - "Send Announcement" button
   - Member management table (approve/deny requests, change roles)
   - Analytics charts (member growth, event attendance trends)

4. Create Club Form (/clubs/create):
   - Club name, description, category
   - Logo and cover image upload
   - Leadership selection (search for users)
   - Meeting schedule
   - Social links
   - Tags for discovery
   - Submit for approval (pending admin review)

5. My Clubs Page (/clubs/my-clubs):
   - Tabs: Leading, Member Of
   - Quick access to club dashboards
   - Leave club action (with confirmation)

State Management:
- Redux slice for clubs (list, selectedClub, myClubs)
- RTK Query for: fetchClubs, fetchClubById, createClub, joinClub, leaveClub, updateClub
- Member management actions

Components:
- ClubCard, ClubFilters, ClubDetail, ClubForm, MemberList, LeadershipSection, ClubAnnouncements
```

---

## Prompt 3.6: Team Matching & Collaboration Pages

```
Build the AI-powered team matching interface.

1. Team Matches Page (/teams):
   - Hero: "Find Your Perfect Team."
   - AI analysis description
   - Filter bar: All Hackathons, skill filters (React, Python, UI Design), "Add Skill" button
   - Top Matches section with match percentage badges (98%, 94%, 91%)
   - Match cards:
     - Profile picture
     - Name, year, major
     - Skill tags
     - Project description/bio snippet
     - "Request to Join" button
   - "Based on AI Analysis" disclaimer
   - Explore Talent section (manual browsing below matches)

2. Team Match Detail Modal:
   - Full profile view
   - All skills with proficiency levels
   - Past projects/portfolio
   - Common interests highlighted
   - Detailed match breakdown (skill overlap, interest alignment)
   - "Send Request" with optional message
   - "View Full Profile" link

3. Create Project Page (/teams/projects/create):
   - Project title and description
   - Required skills selection (multi-select)
   - Preferred proficiency levels
   - Timeline/deadline
   - Related event/hackathon (optional)
   - Max team size
   - Visibility (public/private)

4. My Projects Page (/teams/my-projects):
   - Tabs: Leading, Joined, Requests
   - Project cards with status (Open, In Progress, Completed)
   - Team member avatars
   - Pending requests badge count
   - Quick actions: Edit, View, Manage Team

5. Project Detail Page (/teams/projects/:id):
   - Project information
   - Current team members with roles
   - Required skills (filled/unfilled)
   - Request to join button (if open)
   - Team chat/discussion section (basic)
   - Project status updates

6. Team Requests Page (/teams/requests):
   - List of incoming requests for user's projects
   - Request cards: Requester profile, match %, message, project name
   - Actions: Accept, View Profile, Decline
   - Notification badge when new requests arrive

State Management:
- Redux slice for teams (matches, projects, requests)
- RTK Query for: fetchMatches, createProject, requestToJoin, acceptRequest, declineRequest
- WebSocket integration for real-time request notifications

Components:
- MatchCard, MatchDetailModal, ProjectCard, ProjectForm, TeamMemberList, RequestCard
```

---

## Prompt 3.7: Campus Map & Location Features

```
Implement the interactive campus map with event overlay.

1. Map Page (/map):
   - Full-screen interactive map
   - Toggle buttons: Events, Buildings, Dining
   - Search bar for buildings
   - Current location button (request geolocation permission)
   - Zoom in/out controls
   - Events Nearby panel (sidebar):
     - List of nearby events with distance
     - Status badges: "LIVE NOW", "STARTS AT 2PM"
     - Event cards with: name, location, time, distance
     - Quick actions: "Remind Me", "Join Session"

2. Map Implementation:
   - Mapbox GL JS or Google Maps React
   - Custom markers for events (color-coded by category)
   - Building outlines and labels
   - Dining hall markers
   - Click on marker to show event/building details
   - Route to location (integration with Google Maps/Apple Maps)

3. Event Markers:
   - Color-coded by status (live = red, upcoming = blue, past = gray)
   - Cluster markers when zoomed out
   - Popup on click with event details and RSVP button

4. Building Search:
   - Autocomplete dropdown
   - Filter by building type (academic, residential, dining, sports)
   - Click to zoom to building and highlight

5. Geolocation Features:
   - Request user location permission
   - Show "You are here" marker
   - Calculate distance to events/buildings
   - Sort events by proximity

State Management:
- Redux slice for map (viewport, markers, selectedLocation, filters)
- RTK Query for: fetchLocations, fetchNearbyEvents
- Real-time updates for live events (WebSocket)

Components:
- MapContainer, MapControls, MapMarker, EventPopup, LocationSearch, EventsNearbyPanel

Technical Considerations:
- Lazy load map library (code splitting)
- Optimize marker rendering (clustering)
- Handle offline state
- Responsive design (mobile-friendly map controls)
```

---

## Prompt 3.8: Dashboard & Home Page

```
Create the main Dashboard (home page) for The Quad.

1. Dashboard Layout (/dashboard):
   - Welcome message: "Welcome, Scout" with profile picture
   - Summary cards section:
     - Upcoming RSVPs (count with "View schedule" link)
     - New Team Requests (count with "Review invitations" link)
     - Club Updates (count with "Check announcements" link)
   - "Happening Now" section:
     - Live events carousel with "LIVE" badge
     - Event cards with location badge, RSVP count
     - "Starts in 15m" countdown for upcoming events
   - "Suggested for You" section:
     - AI-recommended events based on interests
     - Club recommendations
     - Project matches
     - "Based on your interests in Coding, Electronic Music, and Strategy Games"
   - Quick access shortcuts to Events, Clubs, Teams pages

2. Personalization Logic:
   - Fetch user interests and skills from profile
   - Display recommendations based on:
     - Event category matches
     - Club tags alignment
     - Skill-based team matches
   - "AI Recommended" badges

3. Notifications Panel (slide-out):
   - Bell icon in TopBar with unread count badge
   - Slide-out panel from right
   - Notification list (grouped by type)
   - Mark as read action
   - Click to navigate to related page
   - "Clear All" button

4. Live Event Updates:
   - WebSocket connection for real-time updates
   - Auto-refresh "Happening Now" section
   - Toast notifications for relevant events starting soon

State Management:
- Redux slice for dashboard (summary, recommendations, liveEvents)
- RTK Query for: fetchDashboardData, fetchRecommendations, fetchLiveEvents
- WebSocket integration for real-time updates

Components:
- DashboardSummaryCard, HappeningNowCarousel, SuggestedForYou, NotificationPanel, LiveEventCard
```

---

## Prompt 3.9: Notifications & Chat Interface

```
Build the notifications system and basic chat functionality.

1. Notifications Center (/notifications):
   - Tabs: All, Events, Clubs, Teams, System
   - Notification list with:
     - Icon/avatar based on type
     - Title and body text
     - Timestamp (relative: "2m ago", "1h ago")
     - Read/unread indicator (bold for unread)
     - Action buttons (View Event, Accept Request, etc.)
   - Mark all as read button
   - Filter by unread only
   - Infinite scroll for older notifications
   - Empty state when no notifications

2. Notification Toast (Global):
   - Appears in top-right corner
   - Auto-dismiss after 5 seconds (configurable)
   - Types: success, error, info, warning
   - Click to dismiss or navigate
   - Queue multiple notifications
   - Sound/vibration option (user preference)

3. Real-Time Notification Delivery:
   - WebSocket listener for incoming notifications
   - Update bell icon badge count
   - Show toast for important notifications
   - Play notification sound (if enabled)
   - Add to notification center list

4. Notification Preferences (/settings/notifications):
   - Toggle switches for each notification type:
     - Email notifications (on/off)
     - Push notifications (on/off)
     - Event reminders (on/off)
     - Club announcements (on/off)
     - Team requests (on/off)
   - Notification sound toggle
   - Do Not Disturb schedule

5. Basic Chat Interface (for Team Projects):
   - Chat sidebar for project teams
   - Message list with sender avatar and name
   - Text input with send button
   - Emoji picker (optional)
   - Real-time message delivery (Socket.io)
   - Message timestamps
   - "User is typing..." indicator
   - Scroll to bottom on new message

State Management:
- Redux slice for notifications (list, unreadCount, preferences)
- RTK Query for: fetchNotifications, markAsRead, updatePreferences
- WebSocket integration for real-time delivery
- Toast queue management

Components:
- NotificationList, NotificationItem, NotificationToast, NotificationBadge, ChatWindow, MessageBubble
```

---

## Prompt 3.10: Student Portfolio & Profile Pages

```
Create student profile and portfolio pages.

1. Public Profile Page (/profile/:userId):
   - Profile header:
     - Large profile picture
     - Name, major, year, class
     - "Download CV" and "Edit Portfolio" buttons (if own profile)
   - Team Matcher Skills section:
     - Skill tags with proficiency indicators
     - "Public Speaking", "FastAPI", "Strategy", etc.
   - Digital Achievement Badges:
     - Badge grid: Founder 101, Hackathon Top 3, Community Pillar
     - Locked "Next Milestone" badge with progress bar
     - "View NFT Wallet" link (future feature)
   - My Clubs section:
     - Club cards with role labels (Active Member, Lead Designer, Participant)
     - Click to view club details
   - Events Dashboard:
     - Tabs: Upcoming, Past
     - Confirmed RSVP events with "Add to Calendar" button
     - Past event history with attendance badges

2. Edit Profile Page (/profile/edit):
   - Multi-section form:
     - Basic Info (name, bio, major, year)
     - Profile picture upload with crop
     - Skills management (add/remove skills, set proficiency)
     - Interests selection (multi-select tags)
     - Social links (LinkedIn, GitHub, portfolio website)
   - Save changes button
   - Preview mode toggle

3. Portfolio Builder (/portfolio/edit):
   - Sections:
     - About Me (rich text editor)
     - Projects showcase (add project cards with images, descriptions, links)
     - Skills matrix (visual representation)
     - Achievements timeline
   - Drag-and-drop section reordering
   - Visibility toggles (show/hide sections)
   - Portfolio preview

4. Achievement System:
   - Badge collection display
   - Progress indicators for upcoming badges
   - Badge detail modal (description, criteria, date earned)
   - Social sharing buttons for badges
   - NFT integration placeholder (future)

State Management:
- Redux slice for profile (userData, portfolio, badges)
- RTK Query for: fetchProfile, updateProfile, uploadAvatar, fetchBadges
- Form state management (React Hook Form)

Components:
- ProfileHeader, SkillsList, BadgeGrid, ClubMemberships, EventHistory, ProfileEditForm, PortfolioBuilder, BadgeCard
```

---

## Prompt 3.11: Admin Dashboard & Analytics

```
Build the comprehensive admin dashboard.

1. Admin Dashboard Home (/admin):
   - "Campus Pulse Dashboard" header
   - Quick stats cards:
     - Active Students (with % change indicator)
     - Upcoming Events (count)
     - New Club Requests (with "High Priority" badge)
     - System Health (status indicator)
   - Student Engagement Trends chart:
     - Bar chart showing daily RSVP volume
     - Week view (Mon-Sun)
     - Date range selector
   - Quick Actions panel:
     - "Approve New Club" (with pending count)
     - "Audit Logs"
     - "Role Management"
   - "Need help?" widget with documentation link

2. User Management Page (/admin/users):
   - "Recent Student Activity" table:
     - Columns: Student (name + email), Current Role, Status, Joined Date, Actions
     - Filter by role, status, date range
     - Search by name/email
     - Action dropdown: View Profile, Edit Role, Deactivate
   - "View All Users" link
   - Export user list (CSV)
   - Bulk actions (multi-select)

3. Club Approval Page (/admin/clubs/pending):
   - Pending applications queue
   - Club cards with:
     - Club name, category, description
     - Proposed leaders
     - Expected membership
     - Application date
   - Approve/Reject buttons
   - Rejection reason modal (send feedback to applicants)
   - Approved/rejected history

4. Analytics & Reports (/admin/analytics):
   - Filters: Date range, campus (if multi-campus)
   - Engagement metrics:
     - Total active users over time (line chart)
     - Event participation rate (pie chart)
     - Top clubs by membership (bar chart)
     - Event categories breakdown (donut chart)
   - Demographics:
     - By major (bar chart)
     - By year (pie chart)
     - By college (if applicable)
   - "Generate Engagement Report" button (download PDF)
   - Schedule recurring reports

5. System Management (/admin/system):
   - System health dashboard
   - Server status indicators
   - Database connection status
   - Cache hit rate (Redis)
   - API response times
   - Error logs viewer
   - Clear cache button
   - Send system-wide announcement form

State Management:
- Redux slice for admin (stats, users, pendingClubs, analytics)
- RTK Query for all admin endpoints
- Real-time updates for pending requests

Components:
- StatCard, EngagementChart, UserTable, ClubApprovalCard, AnalyticsCharts, SystemHealthWidget, AdminActions

Access Control:
- Admin-only routes
- Role check middleware
- Audit logging of all admin actions
```

---

## Prompt 3.12: Nexus AI Chatbot Interface

```
Create the Nexus AI chatbot user interface.

1. Chatbot Widget (Floating Button):
   - Fixed position bottom-left corner
   - Purple circular button with robot icon
   - "Campus Chatbot" label on hover
   - Unread message badge (if applicable)
   - Click to expand chat window

2. Chat Window (/chat or modal):
   - Header:
     - "Nexus" title with AI BOT badge
     - Minimize and close buttons
   - Chat messages area:
     - Bot messages on left (purple background)
     - User messages on right (blue background)
     - Timestamps
     - Welcome message on first open
     - Suggested questions as chips (e.g., "Where is the Seminar Hall?", "Next basketball team tryouts?", "Library hours today?")
   - Bot response features:
     - Rich content cards (event details, location links)
     - "Add to Cal" buttons in event responses
     - Clickable links
     - Loading indicator while bot is thinking
   - Input area:
     - Text input with placeholder: "Type your question for Nexus..."
     - Voice input button (microphone icon)
     - Send button
     - Character limit indicator (optional)

3. Chat Functionality:
   - Send message on Enter (Shift+Enter for new line)
   - Streaming response (typewriter effect)
   - Suggested follow-ups after bot response
   - Chat history persistence (last 10 messages)
   - Clear conversation button
   - Feedback buttons (thumbs up/down) on bot responses

4. Voice Input (Optional):
   - Voice recording button
   - Speech-to-text conversion
   - Visual indicator while recording
   - Cancel/send recording

5. Mobile Chat View (/chat on mobile):
   - Full-screen chat interface
   - Back button to exit
   - Same functionality as desktop modal

State Management:
- Redux slice for chat (messages, isTyping, conversation history)
- RTK Query mutations for: sendMessage, clearHistory, submitFeedback
- WebSocket for real-time streaming responses

Components:
- ChatWidget, ChatWindow, MessageBubble, SuggestedQuestions, EventCard (in chat), VoiceInput

Technical Considerations:
- Markdown rendering for bot responses
- Link previews
- Auto-scroll to bottom on new message
- Unread message tracking
- Accessibility (screen reader support)
```

---

# PHASE 4: Feature Implementation

## Prompt 4.1: Calendar Integration

```
Implement calendar export and integration features.

Requirements:
1. ICS File Generation:
   - Generate .ics files for events (RFC 5545 compliant)
   - Include: Event title, description, location, start/end times, organizer, URL
   - Handle timezone conversions
   - Add VALARM for reminders (1 hour before)

2. "Add to Calendar" Buttons:
   - Google Calendar (direct URL)
   - Apple Calendar (download .ics)
   - Outlook/Office 365 (direct URL)
   - Download .ics (generic)
   - Detect user's platform and suggest best option

3. Calendar Sync (Future):
   - Google Calendar API integration
   - Two-way sync (import campus events to user's calendar)
   - Event updates sync
   - RSVP status reflection

4. Implementation:
   - Backend endpoint: GET /api/v1/events/:id/calendar.ics
   - Frontend utility for generating calendar links
   - Download trigger for .ics files
   - Success notification after adding to calendar

Components:
- AddToCalendarDropdown
- CalendarButton

Libraries:
- ics (npm package for .ics generation)
- add-to-calendar-button (optional UI library)
```

---

## Prompt 4.2: QR Code Check-In System

```
Build event check-in system using QR codes.

Requirements:
1. QR Code Generation:
   - Generate unique QR code for each user's RSVP
   - Encode: eventId, userId, rsvpId, timestamp, signature (HMAC for security)
   - Store QR code data, not image (generate on-demand)

2. Check-In Flow:
   - User shows QR code at event entrance
   - Organizer scans QR code using app
   - System validates and marks attendance
   - Display attendee name and RSVP status
   - Success/error feedback

3. Scanner Interface:
   - Camera access for QR scanning
   - Real-time QR detection
   - Decode QR data
   - Validate signature and event match
   - Mark attendance in database
   - Show success/failure message

4. Attendee View:
   - QR code displayed on event detail page (if RSVP'd)
   - "Show Check-In Code" button
   - Fullscreen QR code modal
   - Brightness boost for better scanning
   - Fallback: Manual check-in with confirmation code

5. Organizer Dashboard:
   - List of attendees with check-in status
   - Scanner button to check in attendees
   - Manual check-in option (search by name)
   - Real-time attendance count
   - Export attendance list

API Endpoints:
- GET /api/v1/events/:id/checkin/qr - Get user's QR code data
- POST /api/v1/events/:id/checkin - Submit check-in (scanned data)
- GET /api/v1/events/:id/attendees - List attendees with check-in status

Libraries:
- qrcode (npm) for generation
- react-qr-reader or jsQR for scanning
- crypto for HMAC signatures

Components:
- QRCodeDisplay, QRScanner, AttendeeCheckInList, ManualCheckIn
```

---

## Prompt 4.3: Image Upload & Management

```
Implement image upload functionality for profile pictures, event covers, and club logos.

Requirements:
1. Upload Flow:
   - Image selection from device
   - Client-side preview
   - Image cropping interface (for profile pictures, club logos)
   - Resize before upload to reduce file size
   - Progress indicator during upload
   - Error handling (file too large, invalid format)

2. Backend Processing:
   - Multer middleware for file uploads
   - Sharp for image processing:
     - Resize to multiple sizes (thumbnail, medium, large)
     - Compress JPEG/PNG
     - Convert to WebP for better performance
     - Generate blurhash for lazy loading
   - Upload to S3 or Cloudinary
   - Save URLs in database

3. Image Optimization:
   - Lazy loading with IntersectionObserver
   - Responsive images (srcset)
   - Blurhash placeholder while loading
   - CDN delivery

4. Image Management:
   - View uploaded images
   - Delete/replace images
   - Image library for event organizers (reuse images)
   - Default images/avatars

API Endpoints:
- POST /api/v1/upload/image - Upload single image
- POST /api/v1/upload/images - Upload multiple images
- DELETE /api/v1/upload/:imageId - Delete image

Frontend Components:
- ImageUpload, ImageCropper, ImagePreview, ImageGallery

Libraries:
- react-image-crop or react-easy-crop
- Multer (backend)
- Sharp (backend)
- AWS SDK or Cloudinary SDK

Considerations:
- File size limits (5MB for profile, 10MB for event covers)
- Allowed formats: JPEG, PNG, WebP, GIF
- Security: Validate file type on backend
- S3 bucket configuration (private vs public)
```

---

## Prompt 4.4: Search Functionality (Full-Text & Filters)

```
Implement comprehensive search across events, clubs, and users.

1. Global Search Bar (TopBar):
   - Autocomplete suggestions as user types
   - Search across: Events, Clubs, Users (People)
   - Grouped results in dropdown
   - "See all results" link for each category
   - Recent searches history
   - Clear search button

2. Advanced Search Page (/search):
   - Search query input
   - Filter sidebar:
     - Content type (Events, Clubs, People, All)
     - Date range (for events)
     - Category filters
     - Location filters
   - Results list with relevance sorting
   - Pagination
   - "No results" state with suggestions

3. Event-Specific Search (/events with search):
   - Full-text search on title, description, tags
   - Filters: Category, Date, Location, Organizer
   - Sort options: Relevance, Date (ascending/descending), Popularity

4. Club-Specific Search (/clubs with search):
   - Full-text search on name, description, tags
   - Filters: Category, Size, Activity Level
   - Sort options: Relevance, Members (descending), Recent Activity

5. Backend Implementation:
   - MongoDB text indexes on searchable fields
   - Aggregation pipeline for complex searches
   - Score-based ranking for relevance
   - Caching popular searches (Redis)
   - Search analytics (track popular queries)

6. Search Optimization:
   - Debounced search input (500ms)
   - Cancel previous request on new search
   - Minimum 2 characters before search
   - Fuzzy matching for typo tolerance
   - Highlight search terms in results

API Endpoints:
- GET /api/v1/search?q=hackathon&type=events&filters=...
- GET /api/v1/search/autocomplete?q=hack
- GET /api/v1/search/suggestions - Popular searches

Components:
- GlobalSearchBar, SearchResults, SearchFilters, AutocompleteDropdown, SearchHighlight

Libraries:
- MongoDB text search or Elasticsearch
- Fuse.js (for client-side fuzzy search, if needed)
- Debounce utility (lodash or custom)
```

---

## Prompt 4.5: Email Templates & Notification System

```
Create HTML email templates and email delivery system.

Email Templates Needed:
1. Welcome Email:
   - Greeting with user's name
   - Platform introduction
   - Quick start guide (discover events, join clubs, find teammates)
   - CTA: Complete your profile
   - Footer with unsubscribe link

2. Event Reminder:
   - Event cover image
   - Event title, date, time, location
   - Map link to location
   - RSVP confirmation
   - "Add to Calendar" button
   - CTA: View Event Details

3. RSVP Confirmation:
   - Confirmation message
   - Event details summary
   - Check-in QR code (embedded image)
   - Calendar file attached
   - Cancellation link

4. Club Announcement:
   - Club logo and name
   - Announcement title and content
   - Sender (club leader name)
   - CTA: View Club Page or Event Details (if announcing an event)

5. Team Request Notification:
   - Requester profile picture and name
   - Project title
   - Match percentage badge
   - Request message
   - CTA buttons: Accept Request, View Profile

6. Password Reset:
   - Reset link (expires in 1 hour)
   - Security warning (if you didn't request this)
   - Contact support link

7. Email Verification:
   - Verification link
   - Welcome message
   - Next steps after verification

Implementation:
1. Template Engine:
   - Handlebars or EJS for HTML templates
   - Reusable components (header, footer, buttons)
   - CSS inlining for email client compatibility
   - Responsive email design

2. Email Service Integration:
   - SendGrid or Nodemailer setup
   - API key configuration
   - From email and domain verification
   - Transactional email templates in SendGrid (optional)

3. Email Queue:
   - Bull queue for email sending
   - Retry logic for failed sends
   - Batch sending for announcements
   - Rate limiting to avoid spam flags

4. Tracking:
   - Open tracking (pixel)
   - Click tracking
   - Unsubscribe handling
   - Bounce and spam complaint handling

5. Testing:
   - Email preview tool (Litmus or Email on Acid)
   - Test emails before production
   - Spam score checking

API Endpoints:
- POST /api/v1/emails/send - Send email (internal use)
- GET /api/v1/emails/unsubscribe/:token - Unsubscribe
- POST /api/v1/emails/test - Send test email (admin)

Folder Structure:
- /email-templates
  - welcome.hbs
  - event-reminder.hbs
  - rsvp-confirmation.hbs
  - etc.

Libraries:
- Nodemailer or SendGrid SDK
- Handlebars/EJS
- Juice (CSS inlining)
- Bull/BullMQ (queue)
```

---

## Prompt 4.6: Analytics & Tracking Implementation

```
Set up analytics tracking across The Quad platform.

1. Event Tracking:
   - Page views (all pages)
   - User actions: RSVP, Cancel RSVP, Join Club, Leave Club, Team Request, Search Query
   - Button clicks (CTA tracking)
   - Form submissions (errors, success)
   - File uploads
   - External link clicks

2. Custom Events:
   - Event discovery (source: search, recommendation, map, etc.)
   - Club discovery
   - Team match clicks
   - Notification interactions
   - Chat messages sent
   - QR code scans

3. User Properties:
   - User ID, email
   - Role (student, club_leader, admin)
   - Major, year
   - Skills and interests
   - Clubs joined count
   - Events RSVP'd count

4. Funnels:
   - Registration flow completion rate
   - Event RSVP funnel (view → RSVP → attend)
   - Club join funnel
   - Team matching funnel (view match → send request → accepted)

5. Implementation:
   - Google Analytics 4 setup
   - Custom event tracking with gtag.js or analytics.js
   - React Router integration (page view tracking)
   - Event tracking wrapper functions
   - User identification (set user ID after login)
   - Anonymize IP addresses for privacy

6. Backend Analytics:
   - Log important events in database (audit trail)
   - Aggregation queries for admin dashboard
   - Daily/weekly/monthly reports
   - Export analytics data

7. Mixpanel/Amplitude (Alternative):
   - More detailed user behavior tracking
   - Cohort analysis
   - Retention reports
   - A/B testing support

8. Privacy Considerations:
   - Cookie consent banner
   - GDPR compliance (opt-out option)
   - Anonymize PII before sending to analytics
   - Data retention policy

Components:
- Analytics utility functions (trackEvent, trackPageView, setUserId)
- Cookie consent banner
- Analytics dashboard for admins

Libraries:
- react-ga4 or @analytics/google-analytics
- @analytics/mixpanel (if using Mixpanel)
- react-cookie-consent
```

---

## Prompt 4.7: Geolocation & Location Services

```
Implement geolocation features for The Quad platform.

1. User Location:
   - Request browser geolocation permission
   - Get current location (latitude, longitude)
   - Store user's home location in profile (optional)
   - Update location periodically (with permission)
   - Handle permission denied gracefully

2. Nearby Events:
   - Calculate distance from user to event locations
   - Sort events by proximity
   - Filter events within X miles/km
   - "Events Near Me" section on dashboard
   - Map view with user location marker

3. Distance Calculations:
   - Haversine formula for distance between coordinates
   - Display distance in miles or kilometers (user preference)
   - "Walking distance" vs "Driving distance" estimates

4. Location Search:
   - Search buildings by name
   - Autocomplete for campus locations
   - Geocoding (address → coordinates) for new locations
   - Reverse geocoding (coordinates → address)

5. Directions:
   - Generate directions to event location
   - Integration with Google Maps / Apple Maps
   - "Get Directions" button opens native map app
   - Walking/driving/transit options

6. Geofencing (Optional):
   - Trigger notifications when user enters event location area
   - Auto-check-in when near event
   - Alert for events happening nearby

Backend:
- Store locations with GeoJSON format
- MongoDB geospatial queries ($near, $geoWithin)
- Geospatial indexes (2dsphere)

API Endpoints:
- GET /api/v1/events/nearby?lat=&lng=&radius=
- GET /api/v1/locations/search?q=seminar
- POST /api/v1/users/location - Update user location

Frontend:
- Geolocation API (navigator.geolocation)
- Mapbox/Google Maps for rendering
- Distance utility functions

Libraries:
- geolib (distance calculations)
- Mapbox GL JS or Google Maps API
- turf.js (geospatial utilities)

Privacy:
- Only request location when needed
- Clear permission explanations
- Allow users to manually set location
- Option to disable location tracking
```

---

## Prompt 4.8: Responsive Design & Mobile Optimization

```
Optimize The Quad platform for mobile devices and various screen sizes.

1. Responsive Breakpoints:
   - Mobile: < 768px
   - Tablet: 768px - 1024px
   - Desktop: > 1024px
   - Large Desktop: > 1440px

2. Mobile Navigation:
   - Bottom tab bar (Dashboard, Events, Clubs, Map, Profile)
   - Hamburger menu for secondary actions
   - Swipeable tabs
   - Collapsible sidebar on mobile

3. Touch Optimization:
   - Minimum 44x44px tap targets
   - Swipe gestures (swipe left to delete, swipe right to RSVP)
   - Pull to refresh on lists
   - Touch-friendly form inputs (larger text fields)
   - Scrollable card carousels

4. Mobile-Specific Features:
   - Native share API (share event, club, profile)
   - Install prompt for PWA
   - Fullscreen mode for map and QR scanner
   - Camera access for QR scanning
   - Push notifications

5. Performance Optimization:
   - Lazy load images
   - Code splitting by route
   - Compress images for mobile
   - Reduce JavaScript bundle size
   - Service worker for offline access

6. Progressive Web App (PWA):
   - manifest.json with app metadata
   - Service worker for caching
   - Offline fallback page
   - Add to home screen prompt
   - Splash screen

7. Tablet Layout:
   - Two-column layouts where appropriate
   - Larger cards and images
   - Side-by-side views (events list + map)

8. Responsive Components:
   - Responsive grid (Tailwind CSS grid)
   - Flexible typography (rem units)
   - Adaptive images (srcset, sizes)
   - Mobile-friendly modals (full-screen on mobile)
   - Collapsible filters

9. Testing:
   - Test on real devices (iOS, Android)
   - Browser DevTools responsive mode
   - Lighthouse performance audit
   - Accessibility audit

Implementation:
- Tailwind CSS responsive utilities (sm:, md:, lg:)
- CSS Grid and Flexbox
- Media queries for custom breakpoints
- React hooks for viewport detection (useMediaQuery)

Libraries:
- workbox (service worker)
- react-device-detect (device detection)
- react-responsive (responsive utilities)
```

---

# PHASE 5: Integration & Testing

## Prompt 5.1: API Integration Testing

```
Set up comprehensive API testing for The Quad backend.

Testing Framework Setup:
- Mocha/Chai or Jest for testing
- Supertest for API endpoint testing
- MongoDB Memory Server for test database
- Test environment configuration

Test Categories:

1. Authentication Tests:
   - User registration (success, validation errors, duplicate email)
   - Login (valid credentials, invalid credentials, account locked)
   - JWT token generation and validation
   - Token refresh
   - Password reset flow
   - OAuth callback handling
   - Logout

2. Event API Tests:
   - Create event (valid data, missing fields, unauthorized)
   - Get event list (pagination, filters, search)
   - Get event by ID (exists, not found)
   - Update event (owner, non-owner, admin)
   - Delete event (owner, non-owner, admin)
   - RSVP to event (capacity limits, already RSVP'd)
   - Cancel RSVP
   - Get attendees list
   - Check-in flow

3. Club API Tests:
   - Create club (pending approval)
   - Join club (pending, approved)
   - Leave club
   - Update club (leader only)
   - Get club members
   - Send announcement (leader only)
   - Club analytics (leader only)

4. Team Matching Tests:
   - Get matches (based on skills)
   - Create project
   - Send team request
   - Accept/decline request
   - Project updates

5. Search Tests:
   - Search events (various queries)
   - Search clubs
   - Autocomplete
   - Filters

6. Admin Tests:
   - Dashboard stats
   - Approve/reject clubs
   - User management
   - Analytics reports

Test Structure:
```javascript
describe('Event API', () => {
  describe('POST /api/v1/events', () => {
    it('should create event with valid data', async () => {
      // Test implementation
    });
    
    it('should return 400 for missing required fields', async () => {
      // Test implementation
    });
    
    it('should return 401 for unauthenticated request', async () => {
      // Test implementation
    });
  });
  
  describe('GET /api/v1/events/:id', () => {
    it('should return event details', async () => {
      // Test implementation
    });
    
    it('should return 404 for non-existent event', async () => {
      // Test implementation
    });
  });
});
```

Testing Best Practices:
- Setup and teardown (before/after hooks)
- Seed test data
- Clear database between tests
- Mock external services (OpenAI, SendGrid, S3)
- Test error handling
- Test edge cases
- Coverage reports (aim for 80%+)

Run Configuration:
- npm test - Run all tests
- npm run test:watch - Watch mode
- npm run test:coverage - Coverage report
- Separate test database
```

---

## Prompt 5.2: Frontend Component Testing

```
Implement testing for React components in The Quad.

Testing Setup:
- Jest as test runner
- React Testing Library for component testing
- Mock Service Worker (MSW) for API mocking
- Testing utilities for Redux

Test Categories:

1. Component Unit Tests:
   - Button variations (primary, secondary, disabled, loading)
   - Form inputs (validation, error states, onChange)
   - Cards (event card, club card, team match card)
   - Modals (open/close, form submission)
   - Navigation (links, active states)

2. Integration Tests:
   - Login flow (form submission, error handling, redirect)
   - Event RSVP (click button, optimistic update, API call)
   - Club join (request sent, pending state)
   - Search (input change, debounce, results display)
   - Notifications (receive, mark as read, navigate)

3. Page Tests:
   - Dashboard (loads data, displays correctly, interactions)
   - Events page (list, filters, search, pagination)
   - Event detail (loads event, RSVP button, calendar export)
   - Club detail (loads club, join button, member list)
   - Profile page (displays user data, edit mode)

4. Redux Tests:
   - Action creators
   - Reducers (state updates)
   - Selectors
   - RTK Query endpoints (caching, optimistic updates)

Example Test:
```javascript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import EventCard from './EventCard';
import { store } from '../store';

describe('EventCard', () => {
  const mockEvent = {
    id: '1',
    title: 'React Workshop',
    date: '2026-05-01',
    location: 'Room 101',
    rsvpCount: 25,
  };

  it('renders event details correctly', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <EventCard event={mockEvent} />
        </BrowserRouter>
      </Provider>
    );
    
    expect(screen.getByText('React Workshop')).toBeInTheDocument();
    expect(screen.getByText('Room 101')).toBeInTheDocument();
    expect(screen.getByText('25 RSVPs')).toBeInTheDocument();
  });

  it('handles RSVP click', async () => {
    const mockRSVP = jest.fn();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <EventCard event={mockEvent} onRSVP={mockRSVP} />
        </BrowserRouter>
      </Provider>
    );
    
    const rsvpButton = screen.getByText('RSVP Now');
    fireEvent.click(rsvpButton);
    
    await waitFor(() => {
      expect(mockRSVP).toHaveBeenCalledWith('1');
    });
  });
});
```

Testing Best Practices:
- Test user behavior, not implementation
- Use accessible queries (getByRole, getByLabelText)
- Mock API calls with MSW
- Test loading and error states
- Test accessibility (ARIA attributes, keyboard navigation)
- Snapshot tests for UI consistency (use sparingly)

Coverage Goals:
- Components: 80%+
- Utilities: 90%+
- Redux logic: 90%+
```

---

## Prompt 5.3: End-to-End Testing

```
Set up end-to-end testing with Cypress or Playwright.

Setup:
- Cypress or Playwright installation
- Test database seeding
- Base URL configuration
- Custom commands/fixtures

Critical User Flows to Test:

1. User Registration & Onboarding:
   - Navigate to registration page
   - Fill out form (email, password, name, major, year)
   - Select skills
   - Select interests
   - Submit form
   - Verify email sent (check mock email server)
   - Click verification link
   - Redirected to dashboard

2. Event Discovery & RSVP:
   - Login
   - Navigate to events page
   - Search for "hackathon"
   - Filter by category "Tech"
   - Click on event card
   - View event details
   - Click RSVP button
   - Verify RSVP confirmation toast
   - Check event appears in "My Events"
   - Add to calendar
   - View QR code

3. Club Join Flow:
   - Navigate to clubs page
   - Browse featured clubs
   - Search for club
   - Click on club card
   - View club details
   - Click "Join Club" button
   - Verify pending request status
   - Admin approves request (admin flow)
   - Verify member status updated

4. Team Matching:
   - Navigate to Teams page
   - View AI-generated matches
   - Filter by skills
   - Click on match card
   - View detailed match profile
   - Send team request with message
   - Recipient receives notification
   - Recipient accepts request
   - Verify team formation

5. Admin Workflows:
   - Admin login
   - Navigate to admin dashboard
   - View analytics
   - Navigate to pending clubs
   - Review club application
   - Approve club
   - Verify club is now active
   - Generate engagement report

Example Cypress Test:
```javascript
describe('Event RSVP Flow', () => {
  before(() => {
    // Seed database with test data
    cy.exec('npm run seed:test');
  });

  beforeEach(() => {
    // Login before each test
    cy.login('test@example.com', 'password123');
  });

  it('allows user to RSVP to an event', () => {
    // Navigate to events page
    cy.visit('/events');
    
    // Search for event
    cy.get('[data-testid="search-input"]').type('React Workshop');
    cy.get('[data-testid="event-card"]').first().click();
    
    // Verify event details page
    cy.url().should('include', '/events/');
    cy.contains('React Workshop');
    
    // RSVP to event
    cy.get('[data-testid="rsvp-button"]').click();
    
    // Verify success toast
    cy.contains('Successfully RSVP\'d to event');
    
    // Verify button state changed
    cy.get('[data-testid="rsvp-button"]').should('contain', 'Cancel RSVP');
    
    // Navigate to My Events
    cy.visit('/events/my-rsvps');
    
    // Verify event appears in list
    cy.contains('React Workshop');
  });
});
```

Test Organization:
- /cypress/e2e/ - Test files
- /cypress/fixtures/ - Test data
- /cypress/support/commands.js - Custom commands
- /cypress/support/e2e.js - Global configuration

Custom Commands:
```javascript
// Login command
Cypress.Commands.add('login', (email, password) => {
  cy.visit('/login');
  cy.get('[name="email"]').type(email);
  cy.get('[name="password"]').type(password);
  cy.get('button[type="submit"]').click();
  cy.url().should('include', '/dashboard');
});

// Seed database command
Cypress.Commands.add('seedDatabase', () => {
  cy.exec('npm run db:seed:test');
});
```

Run Configuration:
- npm run e2e - Run all E2E tests
- npm run e2e:open - Open Cypress UI
- npm run e2e:ci - Headless mode for CI/CD
```

---

## Prompt 5.4: Performance Testing & Optimization

```
Conduct performance testing and optimization for The Quad.

1. Lighthouse Audits:
   - Run Lighthouse on all major pages
   - Target scores: Performance 90+, Accessibility 100, Best Practices 100, SEO 90+
   - Fix identified issues (image optimization, render-blocking resources, etc.)

2. Load Testing (Backend):
   - Use Artillery or k6 for load testing
   - Simulate concurrent users (100, 500, 1000, 5000)
   - Test scenarios:
     - User login
     - Event list API
     - Event RSVP
     - Search queries
     - Real-time notifications
   - Measure: Response times, error rates, throughput
   - Identify bottlenecks

3. Database Query Optimization:
   - Analyze slow queries (MongoDB profiler)
   - Add missing indexes
   - Optimize aggregation pipelines
   - Implement query result caching (Redis)
   - Connection pool tuning

4. Frontend Performance:
   - Code splitting (route-based)
   - Lazy load components (React.lazy)
   - Image optimization (WebP, responsive images)
   - Minimize bundle size (analyze with webpack-bundle-analyzer)
   - Reduce third-party scripts
   - Implement virtual scrolling for long lists
   - Debounce search inputs
   - Memoize expensive computations (useMemo, React.memo)

5. API Optimization:
   - Implement response compression (gzip)
   - Rate limiting to prevent abuse
   - Pagination for all list endpoints
   - Field selection (only return needed fields)
   - Batch requests where possible
   - CDN for static assets

6. Caching Strategy:
   - Redis cache for:
     - User sessions
     - Event lists (short TTL)
     - Search results
     - Recommendations
   - Browser caching headers
   - Service worker caching (PWA)

7. Monitoring:
   - Set up APM (Application Performance Monitoring) with New Relic or DataDog
   - Track: API response times, database query times, error rates
   - Set up alerts for performance degradation
   - Real User Monitoring (RUM)

Example Load Test (Artillery):
```yaml
config:
  target: 'http://localhost:5000'
  phases:
    - duration: 60
      arrivalRate: 10
      name: Warm up
    - duration: 120
      arrivalRate: 50
      name: Sustained load
    - duration: 60
      arrivalRate: 100
      name: Spike

scenarios:
  - name: "Event RSVP Flow"
    flow:
      - post:
          url: "/api/v1/auth/login"
          json:
            email: "test@example.com"
            password: "password123"
          capture:
            - json: "$.token"
              as: "token"
      - get:
          url: "/api/v1/events"
          headers:
            Authorization: "Bearer {{ token }}"
      - post:
          url: "/api/v1/events/{{ $randomString() }}/rsvp"
          headers:
            Authorization: "Bearer {{ token }}"
```

Performance Goals:
- API response time (p95): < 200ms
- Page load time: < 2s
- Time to Interactive (TTI): < 3s
- Concurrent users supported: 10,000+
- Database query time (p95): < 50ms
```

---

# PHASE 6: Deployment & DevOps

## Prompt 6.1: Docker Setup for Development & Production

```
Create Docker configuration for The Quad platform.

Requirements:

1. Development Environment:
   - Docker Compose with services: backend, frontend, mongodb, redis
   - Hot reload for both frontend and backend
   - Volume mounts for code changes
   - Environment variables from .env files
   - Network configuration for service communication

2. Production Dockerfiles:
   - Multi-stage builds for smaller images
   - Separate Dockerfiles for backend and frontend
   - Security best practices (non-root user, minimal base image)
   - Health checks

3. Docker Compose Files:
   - docker-compose.dev.yml - Development
   - docker-compose.prod.yml - Production
   - docker-compose.test.yml - Testing

Backend Dockerfile (Production):
```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .

# Production stage
FROM node:18-alpine
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001
WORKDIR /app
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --chown=nodejs:nodejs . .
USER nodejs
EXPOSE 5000
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js
CMD ["node", "server.js"]
```

Frontend Dockerfile (Production):
```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Docker Compose (Development):
```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.dev
    ports:
      - "5000:5000"
    volumes:
      - ./backend:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
      - MONGODB_URI=mongodb://mongodb:27017/thequad
      - REDIS_URL=redis://redis:6379
    env_file:
      - ./backend/.env.development
    depends_on:
      - mongodb
      - redis
    command: npm run dev

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    volumes:
      - ./frontend:/app
      - /app/node_modules
    environment:
      - VITE_API_URL=http://localhost:5000/api/v1
    command: npm run dev

  mongodb:
    image: mongo:6
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    environment:
      - MONGO_INITDB_DATABASE=thequad

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  mongodb_data:
  redis_data:
```

Commands:
- docker-compose -f docker-compose.dev.yml up - Start dev environment
- docker-compose -f docker-compose.dev.yml down - Stop dev environment
- docker-compose -f docker-compose.prod.yml up -d - Start production
```

---

## Prompt 6.2: CI/CD Pipeline Setup

```
Set up continuous integration and deployment pipeline using GitHub Actions.

Requirements:

1. CI Pipeline (on push/PR):
   - Install dependencies
   - Run linter (ESLint)
   - Run tests (unit, integration)
   - Check test coverage
   - Build application
   - Security scan (npm audit)
   - SonarQube code quality check (optional)

2. CD Pipeline (on merge to main):
   - Build Docker images
   - Push to container registry (Docker Hub, AWS ECR)
   - Deploy to staging environment
   - Run E2E tests on staging
   - Deploy to production (manual approval)
   - Health check after deployment
   - Rollback on failure

3. Automated Tasks:
   - Database migrations
   - Seed test data (staging only)
   - Clear caches
   - Notify team (Slack integration)

GitHub Actions Workflow:
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      mongodb:
        image: mongo:6
        ports:
          - 27017:27017
      redis:
        image: redis:7
        ports:
          - 6379:6379

    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: backend/package-lock.json
      
      - name: Install dependencies
        run: |
          cd backend
          npm ci
      
      - name: Run linter
        run: |
          cd backend
          npm run lint
      
      - name: Run tests
        run: |
          cd backend
          npm test
        env:
          NODE_ENV: test
          MONGODB_URI: mongodb://localhost:27017/thequad_test
          REDIS_URL: redis://localhost:6379
      
      - name: Check test coverage
        run: |
          cd backend
          npm run test:coverage
      
      - name: Security audit
        run: |
          cd backend
          npm audit --audit-level=high

  build-and-deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2
      
      - name: Log in to Container Registry
        uses: docker/login-action@v2
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Build and push Backend image
        uses: docker/build-push-action@v4
        with:
          context: ./backend
          push: true
          tags: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}/backend:latest
      
      - name: Build and push Frontend image
        uses: docker/build-push-action@v4
        with:
          context: ./frontend
          push: true
          tags: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}/frontend:latest
      
      - name: Deploy to Staging
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.STAGING_HOST }}
          username: ${{ secrets.SSH_USERNAME }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /app/thequad
            docker-compose pull
            docker-compose up -d
            docker system prune -f
      
      - name: Run E2E tests on Staging
        run: |
          npm run e2e:ci
        env:
          BASE_URL: https://staging.thequad.app
      
      - name: Deploy to Production
        if: success()
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.PROD_HOST }}
          username: ${{ secrets.SSH_USERNAME }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /app/thequad
            docker-compose pull
            docker-compose up -d
            docker system prune -f
      
      - name: Health Check
        run: |
          sleep 30
          curl -f https://thequad.app/health || exit 1
      
      - name: Notify Slack
        if: always()
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: 'Deployment to production: ${{ job.status }}'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

Secrets to Configure in GitHub:
- STAGING_HOST, PROD_HOST
- SSH_USERNAME, SSH_PRIVATE_KEY
- SLACK_WEBHOOK
- Database credentials
- API keys
```

---

## Prompt 6.3: Cloud Deployment (AWS/DigitalOcean)

```
Deploy The Quad platform to cloud infrastructure.

Option 1: AWS Deployment

1. Infrastructure Setup:
   - VPC with public and private subnets
   - Application Load Balancer (ALB)
   - ECS Fargate for containers (backend, frontend)
   - DocumentDB (MongoDB-compatible) or MongoDB Atlas
   - ElastiCache (Redis)
   - S3 for file storage
   - CloudFront CDN
   - Route 53 for DNS
   - ACM for SSL certificates
   - CloudWatch for logging and monitoring

2. ECS Task Definitions:
   - Backend task (Node.js Express)
   - Frontend task (Nginx serving React build)
   - Configure CPU, memory, environment variables
   - Health check configuration

3. Terraform/CloudFormation:
   - Infrastructure as Code
   - Automated resource provisioning
   - Environment separation (staging, production)

4. Auto Scaling:
   - Configure auto-scaling based on CPU/memory
   - Target tracking scaling policies
   - Min/max instance counts

5. Security:
   - Security groups (restrict access)
   - IAM roles for services
   - Secrets Manager for sensitive data
   - VPC endpoints for private connections

Option 2: DigitalOcean Deployment

1. Resources:
   - App Platform for containers
   - Managed MongoDB
   - Managed Redis
   - Spaces (S3-compatible) for file storage
   - CDN
   - Load Balancer

2. App Platform Configuration:
```yaml
name: thequad
services:
  - name: backend
    dockerfile_path: backend/Dockerfile
    github:
      repo: yourusername/thequad
      branch: main
    env_vars:
      - key: NODE_ENV
        value: production
      - key: MONGODB_URI
        value: ${db.DATABASE_URL}
      - key: REDIS_URL
        value: ${redis.REDIS_URL}
    http_port: 5000
    instance_count: 2
    instance_size_slug: professional-xs
    
  - name: frontend
    dockerfile_path: frontend/Dockerfile
    github:
      repo: yourusername/thequad
      branch: main
    http_port: 80
    instance_count: 2
    instance_size_slug: professional-xs

databases:
  - name: db
    engine: MONGODB
    version: "6"
  - name: redis
    engine: REDIS
    version: "7"
```

Deployment Steps:

1. Initial Setup:
   - Create cloud account
   - Configure billing alerts
   - Set up IAM users/roles
   - Configure CLI tools (AWS CLI, doctl)

2. Database Setup:
   - Create MongoDB cluster
   - Create Redis instance
   - Configure backup policies
   - Set up monitoring

3. Container Registry:
   - Push Docker images
   - Configure image scanning
   - Set up retention policies

4. Deploy Application:
   - Create services/apps
   - Configure environment variables
   - Set up load balancer
   - Configure SSL certificates
   - Point domain to load balancer

5. Monitoring & Alerts:
   - CloudWatch/DO Monitoring
   - Set up alerts for high CPU, memory, errors
   - Log aggregation
   - Uptime monitoring (UptimeRobot)

6. Backup & Disaster Recovery:
   - Automated database backups
   - Backup retention (7-30 days)
   - Test restore procedures
   - Disaster recovery plan

7. Cost Optimization:
   - Right-size instances
   - Use reserved instances (AWS)
   - Enable auto-scaling
   - Review and optimize regularly
```

---

## Prompt 6.4: Monitoring, Logging, and Error Tracking

```
Set up comprehensive monitoring, logging, and error tracking.

1. Application Monitoring (APM):
   - New Relic, DataDog, or AppDynamics
   - Track: Response times, throughput, error rates, database queries
   - Custom metrics: RSVP rate, active users, event creation rate
   - Distributed tracing for microservices

2. Error Tracking:
   - Sentry for frontend and backend
   - Automatic error capture and reporting
   - Source map upload for stack traces
   - User context (user ID, session)
   - Release tracking
   - Email alerts for critical errors

Sentry Setup (Backend):
```javascript
const Sentry = require('@sentry/node');
const Tracing = require('@sentry/tracing');

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Sentry.Integrations.Express({ app }),
    new Tracing.Integrations.Mongo(),
  ],
});

// Request handler (must be first middleware)
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

// Routes...

// Error handler (must be last)
app.use(Sentry.Handlers.errorHandler());
```

Sentry Setup (Frontend):
```javascript
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  integrations: [
    new BrowserTracing(),
  ],
  tracesSampleRate: 0.1,
  beforeSend(event, hint) {
    // Filter out certain errors
    if (event.exception) {
      const error = hint.originalException;
      if (error && error.message && error.message.match(/network/i)) {
        return null; // Don't send network errors
      }
    }
    return event;
  },
});
```

3. Logging:
   - Structured logging with Winston (backend)
   - Log levels: error, warn, info, debug
   - Log rotation (daily, size-based)
   - Centralized logging (ELK Stack, CloudWatch Logs, Papertrail)
   - Log parsing and searching

Winston Setup:
```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'thequad-backend' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

module.exports = logger;
```

4. Uptime Monitoring:
   - UptimeRobot or Pingdom
   - HTTP checks every 5 minutes
   - Alert via email, SMS, Slack
   - Status page for users

5. Real User Monitoring (RUM):
   - Google Analytics 4
   - Track Core Web Vitals (LCP, FID, CLS)
   - Custom events and funnels
   - User flow analysis

6. Alerts Configuration:
   - Critical: Error rate > 1%, Response time > 2s, Downtime
   - Warning: Error rate > 0.5%, High CPU/memory, Slow queries
   - Info: Deployment completed, Backup completed

7. Dashboards:
   - System health dashboard (CPU, memory, disk, network)
   - Application metrics (requests/sec, errors, response times)
   - Business metrics (RSVPs, signups, active users)
   - Database metrics (connections, query times, cache hit rate)

8. Log Retention:
   - Production logs: 30 days
   - Error logs: 90 days
   - Audit logs: 1 year
   - Archive old logs to S3/Glacier
```

---

This completes the comprehensive implementation guide with prompts for all phases of The Quad project!
