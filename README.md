# HD Notes - Note Taking Application

A modern, full-stack note-taking application built with Next.js, TypeScript, and MongoDB.

## Features

- **Google Authentication** - Secure sign-in with Google OAuth
- **Note Management** - Create, view, and delete personal notes
- **Modern UI** - Clean, responsive design with Tailwind CSS
- **Real-time Updates** - Instant UI updates after actions
- **Mobile Responsive** - Works perfectly on all devices
- **API-first** - RESTful API endpoints for all note operations
- **Secure** - Notes are private to each authenticated user

## Tech Stack

- **Frontend**: React.js with TypeScript (Next.js App Router)
- **Backend**: Next.js API routes with TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: NextAuth.js (Google provider, JWT sessions)
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/                # API routes
│   │   ├── notes/          # Note CRUD endpoints
│   │   └── auth/           # Authentication endpoints
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Main page
├── components/             # React UI components
├── lib/                    # Utilities (db, auth)
├── models/                 # Mongoose models
├── types/                  # TypeScript type definitions
```

## Main Components

- **Dashboard**: Displays user notes, allows creation and deletion, and shows user info.
- **AuthPage**: Handles Google sign-in and displays a welcome message.
- **NoteManager**: (If used separately) Manages note CRUD operations.
- **AuthButtons**: Shows sign-in/sign-out buttons and user avatar.

## API Endpoints

### Notes

- `GET /api/notes`  
  Returns all notes for the authenticated user.

- `POST /api/notes`  
  Creates a new note for the authenticated user.  
  **Body:** `{ content: string }`

- `DELETE /api/notes/[id]`  
  Deletes a note by ID (only if it belongs to the authenticated user).

### Authentication

- `POST /api/auth/[...nextauth]`  
  Handles authentication via NextAuth.js (Google provider).

## Data Model

**Note**

- `content` (string, required, max 2000 chars)
- `userId` (string, required)
- `createdAt` (Date, auto)
- `updatedAt` (Date, auto)

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB database
- Google OAuth credentials

### Environment Variables

Create a `.env.local` file in the root:

```
MONGODB_URI=your_mongodb_connection_string
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

### Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Run the development server: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000)

### Deployment

- Deploy on Vercel for best results.
- Set environment variables in the Vercel dashboard.

## Security

- All note endpoints require authentication.
- Users can only access and delete their own notes.
- JWT-based sessions for stateless authentication.

## License

MIT
