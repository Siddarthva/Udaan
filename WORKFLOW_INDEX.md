# UDAAN Workflow Master Index & System Analysis

This document provides a comprehensive index of all 30 business workflows implemented in the UDAAN platform, traced end-to-end across Frontend Components, API Client Functions, Express Routes/Controllers/Services, Supabase Auth, and PostgreSQL Database Tables.

---

## 📊 Master Workflow Index Table

| # | Workflow | Frontend Component | API Endpoint | Backend Route & Controller / Service | Database Tables & Supabase Auth | Diagram Image |
|---|----------|--------------------|--------------|--------------------------------------|---------------------------------|---------------|
| 1 | **User Registration / Signup** | `Login.jsx` | `authApi.register()` | `POST /api/auth/register` → `authController.register` → `AuthService.registerUser()` | `auth.users`, `public.profiles` | [`01_user_signup_workflow.png`](file:///d:/Projects/Udaan/01_user_signup_workflow.png) |
| 2 | **User Login (Email & Username)** | `Login.jsx` | `authApi.login()` | `POST /api/auth/login` → `authController.login` → `AuthService.validateUser()` | `auth.users`, `public.profiles` | [`02_user_login_workflow.png`](file:///d:/Projects/Udaan/02_user_login_workflow.png) |
| 3 | **Authentication & Session** | `App.jsx` / Interceptors | `authApi.getCurrentUser()` | `middleware/auth.js` (`authenticate`) | `auth.users`, `public.profiles` | [`03_auth_session_workflow.png`](file:///d:/Projects/Udaan/03_auth_session_workflow.png) |
| 4 | **Profile Auto-Creation & Fallback** | `authStore.js` | Internal Service Trigger | `AuthService.ensureUserProfile()` | `public.profiles` | [`04_profile_auto_creation_workflow.png`](file:///d:/Projects/Udaan/04_profile_auto_creation_workflow.png) |
| 5 | **Profile Completion Calculation** | `Profile.jsx`, `Dashboard.jsx` | `authApi.getCurrentUser()` | `GET /api/auth/me` → `AuthService.calculateProfileCompletion()` | `public.profiles` | [`05_profile_completion_workflow.png`](file:///d:/Projects/Udaan/05_profile_completion_workflow.png) |
| 6 | **Profile Update** | `Profile.jsx`, `Settings.jsx` | `authApi.updateProfile()` | `PATCH /api/auth/profile` → `AuthService.updateProfile()` | `public.profiles` | [`06_profile_update_workflow.png`](file:///d:/Projects/Udaan/06_profile_update_workflow.png) |
| 7 | **Username Validation** | `Profile.jsx` | `authApi.checkUsername()` | `GET /api/auth/check-username/:username` → `AuthService.checkUsernameAvailability()` | `public.profiles` | [`07_username_validation_workflow.png`](file:///d:/Projects/Udaan/07_username_validation_workflow.png) |
| 8 | **User / Member Search** | `Community.jsx` | `communityApi.fetchMembers()` | `GET /api/community` → `CommunityService.getMembers()` | `public.profiles` | [`08_user_search_workflow.png`](file:///d:/Projects/Udaan/08_user_search_workflow.png) |
| 9 | **Startup Creation / Launch** | `Projects.jsx` | `startupApi.create()` | `POST /api/startups/launch` → `StartupService.createStartup()` | `public.startups`, `public.startup_members` | [`09_startup_creation_workflow.png`](file:///d:/Projects/Udaan/09_startup_creation_workflow.png) |
| 10 | **Startup Editing** | `Projects.jsx` | `startupApi.update()` | `PATCH /api/startups/:id` → `StartupService.updateStartup()` | `public.startups` | [`10_startup_editing_workflow.png`](file:///d:/Projects/Udaan/10_startup_editing_workflow.png) |
| 11 | **Startup Discovery & Filtering** | `Discover.jsx` | `startupApi.fetchAll()` | `GET /api/startups` → `StartupService.listStartups()` | `public.startups`, `public.profiles` | [`11_startup_discovery_workflow.png`](file:///d:/Projects/Udaan/11_startup_discovery_workflow.png) |
| 12 | **Startup Details & Team Retrieval** | `Projects.jsx`, `Discover.jsx` | `startupApi.fetchById()` | `GET /api/startups/:id` → `StartupService.getStartupDetails()` | `public.startups`, `public.startup_members`, `public.startup_documents` | [`12_startup_details_workflow.png`](file:///d:/Projects/Udaan/12_startup_details_workflow.png) |
| 13 | **Startup Team Membership** | `Projects.jsx` | `startupApi.addMember()` | `POST / DELETE /api/startups/:id/members` → `StartupService.addMember()` | `public.startup_members` | [`13_startup_membership_workflow.png`](file:///d:/Projects/Udaan/13_startup_membership_workflow.png) |
| 14 | **Startup Updates & Announcements** | `Projects.jsx` | `startupApi.createUpdate()` | `POST /api/startups/:id/updates` → `StartupService.createStartupUpdate()` | `public.startup_updates` (memory) | [`14_startup_updates_workflow.png`](file:///d:/Projects/Udaan/14_startup_updates_workflow.png) |
| 15 | **Follow / Unfollow Startup** | `Discover.jsx` | `followApi.followStartup()` | `POST / DELETE /api/follow/startup/:id` → `FollowService.followStartup()` | `public.follows`, `public.notifications` | [`15_follow_startup_workflow.png`](file:///d:/Projects/Udaan/15_follow_startup_workflow.png) |
| 16 | **Follow / Unfollow User** | `Community.jsx` | `followApi.followUser()` | `POST / DELETE /api/follow/user/:id` → `FollowService.followUser()` | `public.follows`, `public.notifications` | [`16_follow_user_workflow.png`](file:///d:/Projects/Udaan/16_follow_user_workflow.png) |
| 17 | **Save Startup / Watchlist** | `Discover.jsx`, `Watchlist.jsx` | `investorApi.toggleSave()` | `POST /api/startups/:id/save` → `StartupService.saveStartup()` | `public.saved_startups` (memory) | [`17_saved_startup_workflow.png`](file:///d:/Projects/Udaan/17_saved_startup_workflow.png) |
| 18 | **Investor Interest Expression** | `Discover.jsx` | `investorApi.expressInterest()` | `POST /api/startups/:id/express-interest` → `StartupService.expressInterest()` | `public.investor_interest`, `public.notifications` | [`18_investor_interest_workflow.png`](file:///d:/Projects/Udaan/18_investor_interest_workflow.png) |
| 19 | **Direct Startup Investment** | `InvestmentModal.jsx` | `startupApi.invest()` | `POST /api/startups/:id/invest` → `StartupService.investInStartup()` | `public.startups`, `public.notifications` | [`19_investment_transaction_workflow.png`](file:///d:/Projects/Udaan/19_investment_transaction_workflow.png) |
| 20 | **Mentor Request Submission** | `Discover.jsx`, `Mentors.jsx` | `mentorApi.sendRequest()` | `POST /api/startups/:id/mentor-request` → `StartupService.sendMentorRequest()` | `public.mentor_requests` | [`20_mentor_request_workflow.png`](file:///d:/Projects/Udaan/20_mentor_request_workflow.png) |
| 21 | **Message Request Creation** | `Community.jsx` | `requestsApi.create()` | `POST /api/requests` → `RequestsService.createRequest()` | `public.message_requests`, `public.notifications` | [`21_message_request_workflow.png`](file:///d:/Projects/Udaan/21_message_request_workflow.png) |
| 22 | **Accept / Reject Message Request** | `Messages.jsx` | `requestsApi.accept()` | `PATCH /api/requests/:id/accept` → `RequestsService.acceptRequest()` | `public.message_requests`, `public.conversations`, `public.messages`, `public.notifications` | [`22_accept_reject_request_workflow.png`](file:///d:/Projects/Udaan/22_accept_reject_request_workflow.png) |
| 23 | **Conversation Retrieval** | `Messages.jsx` | `messagesApi.fetchConversations()` | `GET /api/messages/conversations` → `MessagesService.getConversations()` | `public.conversations`, `public.messages`, `public.profiles` | [`23_conversation_workflow.png`](file:///d:/Projects/Udaan/23_conversation_workflow.png) |
| 24 | **Send Message** | `Messages.jsx` | `messagesApi.sendMessage()` | `POST /api/messages/send` → `MessagesService.sendMessage()` | `public.conversations`, `public.messages` | [`24_send_message_workflow.png`](file:///d:/Projects/Udaan/24_send_message_workflow.png) |
| 25 | **Read / Unread Message Status** | `Messages.jsx` | `messagesApi.markRead()` | `PATCH /api/messages/:id/read` → `MessagesService.markAsRead()` | `public.messages` | [`25_read_unread_message_workflow.png`](file:///d:/Projects/Udaan/25_read_unread_message_workflow.png) |
| 26 | **Notifications Fetch & Read** | `Notifications.jsx` | `notificationsApi.fetchAll()` | `GET /api/notifications` → `NotificationsService.getNotifications()` | `public.notifications`, `public.profiles` | [`26_notifications_workflow.png`](file:///d:/Projects/Udaan/26_notifications_workflow.png) |
| 27 | **Settings Update** | `Settings.jsx` | `authApi.updateProfile()` | `PATCH /api/auth/profile` → `AuthService.updateProfile()` | `public.profiles` | [`27_settings_workflow.png`](file:///d:/Projects/Udaan/27_settings_workflow.png) |
| 28 | **Logout** | `Navbar.jsx` | `authApi.logout()` | `POST /api/auth/logout` → `authController.logout` | `Supabase Auth` (signOut) | [`28_logout_workflow.png`](file:///d:/Projects/Udaan/28_logout_workflow.png) |
| 29 | **File & Document Upload** | `Projects.jsx` | `startupApi.uploadFile()` | `POST /api/upload` → `UploadService.uploadFile()` | `Supabase Storage` Buckets | [`29_file_upload_workflow.png`](file:///d:/Projects/Udaan/29_file_upload_workflow.png) |
| 30 | **AI Copilot Assistant** | `Profile.jsx`, Modal | `aiApi.generateBio()` | `POST /api/ai/bio` → `AIService.callGroq()` | External Groq API / Local Fallback | [`30_ai_copilot_workflow.png`](file:///d:/Projects/Udaan/30_ai_copilot_workflow.png) |

---

## 🔍 In-Depth Technical Analysis of Current Implementation

### 1. Workflows Implemented Correctly
- **Supabase Authentication Integration**: Signup (`/api/auth/register`), Login (`/api/auth/login`), and Session Verification (`middleware/auth.js`) correctly connect with Supabase Auth (`authClient.auth.signUp`, `signInWithPassword`, `getUser`).
- **Profile Synchronization & Auto-Creation**: `AuthService.ensureUserProfile()` effectively synchronizes `auth.users` with `public.profiles` using the user's UUID.
- **Messaging & Request Lifecycle**: `RequestsService` and `MessagesService` correctly enforce the request gate (`public.message_requests`) before allowing direct conversations (`public.conversations` and `public.messages`).
- **Groq AI Integration**: `AIService` provides clear fallback mechanisms if the Groq API key is missing, ensuring the UI never breaks.

### 2. Workflows Partially Implemented or Relying on In-Memory Fallbacks
- **Investor Interest & Saved Startups**: `StartupService.saveStartup()` and `expressInterest()` rely on local `Map` instances (`memorySaved`, `memoryInterests`) as fallbacks when Supabase query tables are missing or not pre-populated.
- **Startup Member Management**: `StartupService.addMember()` writes team additions to `memoryMembers` in addition to `public.startup_members`.
- **Startup Announcements / Updates**: `StartupService.createStartupUpdate()` returns synthesized objects without persisting to a `public.startup_updates` SQL table.

### 3. Database Schema & Query Inconsistencies
- **Follow Table Schema Variation**: `FollowService.followUser()` handles schema variations where the destination user column is named `following_id` vs `target_id` by executing fallback `catch` queries for PostgreSQL error code `42703` (undefined column).
- **Role Naming Normalization**: The database expects `innovator`, `mentor`, `sponsor`, whereas client UI uses `Innovator`, `Mentor`, `Investor`. Mapped via `utils/constants.js` (`mapRoleToDb` and `mapRoleToClient`).

### 4. Authentication & Authorization Observations
- **Username Resolution**: Username-based login resolved in `AuthService.validateUser()` via `SELECT email FROM public.profiles WHERE username = ...` before invoking `signInWithPassword()` with the target email.
- **Role-Based Guards**: Role authorization middleware (`allowedRoles(['innovator'])` or `allowedRoles(['sponsor'])`) is active on investment and launch routes, preventing unauthorized role actions.

---

*Generated by Code-First Analysis of UDAAN Repository.*
