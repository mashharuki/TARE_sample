# Netflix Clone - Video Streaming Service

A Netflix-like video streaming service frontend built with React, TypeScript, and Supabase.

## Features

- 🎬 **Video Streaming**: Watch movies and TV shows with a custom video player
- 🔍 **Search & Discovery**: Find content with advanced search and filtering
- 📱 **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- 👤 **User Authentication**: Secure login and registration system
- 📋 **Watchlist**: Save content to watch later
- ⏯️ **Continue Watching**: Resume where you left off
- 👤 **User Profiles**: Personal viewing experience
- 📊 **Viewing Analytics**: Track your watch history and statistics

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: TailwindCSS
- **Backend**: Supabase (Auth, Database, Storage)
- **Video Player**: Video.js + HLS.js
- **Icons**: Lucide React
- **State Management**: React Context + useReducer

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd video-streaming-site
```

2. Install dependencies:
```bash
npm install
```

3. Set up Supabase:
   - Create a new Supabase project at [supabase.com](https://supabase.com)
   - Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```
   - Add your Supabase credentials to `.env`:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Set up the database:
   - Run the SQL commands from `technical_architecture.md` to create tables
   - Set up Row Level Security (RLS) policies

5. Start the development server:
```bash
npm run dev
```

6. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ContentCard.tsx
│   ├── ContentRow.tsx
│   ├── Header.tsx
│   ├── ProtectedRoute.tsx
│   └── VideoPlayer.tsx
├── contexts/           # React Context providers
│   ├── AuthContext.tsx
│   └── VideoContext.tsx
├── lib/                # Utility libraries
│   └── supabase.ts
├── pages/              # Page components
│   ├── BrowsePage.tsx
│   ├── ContinueWatchingPage.tsx
│   ├── HomePage.tsx
│   ├── LoginPage.tsx
│   ├── ProfilePage.tsx
│   ├── RegisterPage.tsx
│   ├── SearchPage.tsx
│   ├── VideoPlayerPage.tsx
│   └── WatchlistPage.tsx
├── types/              # TypeScript type definitions
│   └── index.ts
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── index.css           # Global styles
```

## Pages

- **Home**: Featured content and personalized recommendations
- **Browse**: Browse content by categories and genres
- **Search**: Advanced search with filters and sorting
- **Watch**: Video player with progress tracking
- **Watchlist**: Manage saved content
- **Continue Watching**: Resume partially watched content
- **Profile**: User account and viewing statistics
- **Login/Register**: Authentication pages

## Features in Detail

### Video Player
- Custom controls with play/pause, volume, fullscreen
- Progress tracking and resume functionality
- Support for multiple video formats (HLS, MP4)
- Keyboard shortcuts

### Search & Discovery
- Real-time search suggestions
- Filter by genre, year, rating
- Sort by relevance, popularity, release date
- Search history and trending searches

### User Experience
- Responsive design for all devices
- Smooth animations and transitions
- Loading states and error handling
- Accessibility features

## Database Schema

The application uses the following main tables:

- **users**: User authentication data
- **profiles**: User profile information
- **content**: Video content metadata
- **watch_progress**: User viewing progress
- **watchlist**: User saved content
- **genres**: Content categorization

## API Integration

The application integrates with Supabase for:
- User authentication (login, register, logout)
- Database operations (CRUD)
- Real-time subscriptions
- File storage for thumbnails and videos

## Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy!

### Deploy to Netlify
1. Build the project: `npm run build`
2. Drag the `dist` folder to Netlify
3. Configure environment variables
4. Deploy!

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and test thoroughly
4. Commit your changes: `git commit -am 'Add new feature'`
5. Push to the branch: `git push origin feature-name`
6. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue on GitHub or contact the development team.

---

Built with ❤️ using React, TypeScript, and Supabase.