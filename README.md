# eFIFA BattleZone Season 1 🎮

A real-time tournament management system built with Next.js for FIFA gaming tournaments.

## 🚀 Professional Features

### Core Tournament Management
- **Live Tournament Display** - Real-time updates every 2 seconds
- **Group Stage Management** - Round-robin with FIFA-compliant standings calculation
- **Double Elimination Bracket** - Complete bracket system with upper/lower bracket progression
- **Professional Admin Panel** - Comprehensive match statistics entry with validation
- **Gaming Theme** - Dark theme with neon effects and animations
- **Mobile Responsive** - Fully responsive design for all devices
- **Real-time Polling** - Spectators see updates instantly

### FIFA Compliance & Statistics
- **FIFA Tiebreaker Rules** - Complete 8-criteria tiebreaker system (Points → GD → GF → H2H Points → H2H GD → H2H GF → Fair Play → Drawing of Lots)
- **Head-to-Head Records** - Automatic H2H calculation for tied teams
- **Fair Play Points** - FIFA disciplinary tracking (Yellow = 1pt, Red = 4pts - FC 25 cards only)
- **Essential Match Statistics** - Goals and disciplinary cards (FC 25 compatible)
- **Detailed Player Analytics** - Performance metrics, clean sheets, goals per match, biggest wins/losses
- **Professional Match Reports** - Complete statistical breakdown for each match

### Advanced Features
- **Fair Play Rankings** - Separate disciplinary leaderboard
- **Head-to-Head Matrix** - Visual H2H comparison between all players
- **Player Performance Cards** - Detailed individual statistics display
- **Match Officials Tracking** - Referee and venue information
- **Tournament Metadata** - Complete professional tournament information

## 🎯 Tournament Format

### Group Stage
- 2 groups of 4 players each
- Round-robin format (6 matches per group)
- Top 2 from each group advance to playoffs
- Points: Win = 3, Draw = 1, Loss = 0
- **FIFA Tiebreakers**: Points → Goal Difference → Goals For → Head-to-Head Points → Head-to-Head GD → Head-to-Head GF → Fair Play Points → Drawing of Lots

### Double Elimination Playoffs
- Upper Semi 1: Group A Winner vs Group B Runner-up
- Upper Semi 2: Group B Winner vs Group A Runner-up
- Losers bracket for second chances
- Grand Final: Best of 3

## 🛠️ Setup & Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Environment Variables
Create `.env.local` file:
```
ADMIN_PASSWORD=your_secure_password_here
```

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔐 Secure Admin Access

### Protected Admin Route
1. Visit `/admin` route (e.g., `http://localhost:3000/admin`)
2. **Login Required**: Enter credentials on secure login page:
   - Username: `admin`
   - Password: (set in `ADMIN_PASSWORD` environment variable)
3. After authentication, access admin panel to:
   - Select match from dropdown
   - Enter match result and disciplinary cards (Yellow/Red only)
   - Submit updates instantly to tournament
4. **Logout**: Use logout button to secure session

### Security Features
- ✅ **Protected Route**: Admin page requires authentication before access
- ✅ **Secure Login**: Username/password verification before panel access
- ✅ **Session Management**: Logout functionality to secure admin access
- ✅ **No Public Access**: Admin controls completely hidden from public tournament view

### Essential Statistics Only
Admin panel only tracks statistics that affect tournament progression:
- **Match Results**: Goals scored (for points calculation)
- **Disciplinary Cards**: Yellow/Red cards (for Fair Play tiebreaker)
- **No unnecessary stats**: Corners, offsides, referee info removed for simplicity

## 🌐 Deployment on Vercel

### 1. Install Vercel CLI
```bash
npm i -g vercel
```

### 2. Deploy
```bash
vercel
```

### 3. Set Environment Variable
```bash
vercel env add ADMIN_PASSWORD
# Enter your secure admin password
```

### 4. Redeploy
```bash
vercel --prod
```

## 📱 Usage During Tournament

### For Spectators
- Visit the public URL
- View live standings and match results
- See real-time updates as matches complete
- Follow bracket progression

### For Tournament Admin
1. Access admin panel with credentials (username: `admin`, password from environment)
2. Select pending match from comprehensive dropdown
3. Enter complete match statistics:
   - **Match Result**: Home and away scores
   - **Disciplinary Record**: Yellow cards, red cards, indirect reds for both teams
   - **Match Statistics**: Corners, fouls, offsides, possession percentages
   - **Match Details**: Referee name, match duration
4. Click "Submit Complete Match Report"
5. All spectators see comprehensive updates within 2 seconds

## 🎮 Tournament Data

The system automatically:
- Calculates standings and statistics
- Generates playoff bracket when group stage completes
- Updates fighter positions based on results
- Tracks tournament progression

## 🔧 Technical Details

### Architecture
- **Frontend**: Next.js with React hooks
- **Backend**: Next.js API routes
- **Data Storage**: JSON file (tournament-data.json)
- **Authentication**: HTTP Basic Auth
- **Real-time Updates**: Client-side polling every 2 seconds

### API Endpoints
- `GET /api/tournament` - Public tournament data (includes all statistics)
- `POST /api/tournament` - Admin match statistics updates (auth required)
  - Accepts comprehensive match data: scores, cards, fouls, corners, possession, referee info

### Security
- Basic HTTP authentication for admin functions
- Password stored in environment variables
- CORS headers for cross-origin requests
- Input validation and error handling

## 🎯 Customization

### Adding Players
Edit the `initialData` in `pages/api/tournament.js`:
```javascript
fighters: {
  'PlayerKey': {
    name: 'Full Player Name',
    icon: '🎮',
    group: 'A', // or 'B'
    // Match record
    points: 0, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0,
    // FIFA disciplinary record
    yellowCards: 0, redCards: 0, indirectReds: 0, fairPlayPoints: 0,
    // Detailed statistics
    corners: 0, foulsCommitted: 0, foulsReceived: 0, offsides: 0,
    totalPossession: 0, averagePossession: 0,
    // Performance metrics
    goalsPerMatch: 0, cleanSheets: 0, biggestWin: null, biggestLoss: null
  }
}
```

### Match Schedule
Update the `matches` array with comprehensive match objects including all FIFA statistics fields.

### Professional Styling
Modify `styles/globals.css` for different themes, colors, or layouts. The system includes:
- Responsive design for mobile/tablet/desktop
- Professional admin interface styling
- Comprehensive statistics table layouts
- Fair play and head-to-head display components

## 🏆 Tournament Flow

1. **Group Stage** (12 matches total)
   - 6 matches per group
   - Real-time standings updates
   - Top 2 advance automatically

2. **Playoffs** (5 matches total)
   - Upper bracket semi-finals
   - Lower bracket elimination
   - Upper final and lower final
   - Grand final (Best of 3)

3. **Champions**
   - Automatic winner determination
   - Hall of fame display

## 🎮 Live Features

- **Real-time Polling**: Updates every 2 seconds
- **Live Status Indicator**: Pulsing dot shows system is active
- **Match Status**: Pending → Live → Completed
- **Automatic Progression**: Group stage → Playoffs → Champions
- **Responsive Design**: Works on phones, tablets, desktops

## 🔥 Gaming Theme

- Dark gradient background
- Neon cyan, magenta, yellow accents
- Gaming fonts (Orbitron, Rajdhani)
- Animated effects and transitions
- Fighter icons and gaming emojis
- Professional esports appearance

## 📊 Professional Data Persistence

Tournament data is stored in `tournament-data.json` and includes:
- **Complete Match Records**: Scores, disciplinary actions, detailed statistics, referee info
- **Comprehensive Fighter Statistics**: FIFA-compliant stats, performance metrics, disciplinary records
- **Tournament Progression**: Group stage → Double elimination bracket with upper/lower bracket tracking
- **FIFA Compliance Data**: Head-to-head records, fair play points, tiebreaker calculations
- **Professional Metadata**: Tournament information, match officials, venues
- **Double Elimination Structure**: Upper bracket, lower bracket, grand final progression
- **Champions and Rankings**: Complete tournament results with detailed statistics

## 🎯 Perfect For

- **Professional Esports Tournaments** - FIFA-compliant rules and comprehensive statistics
- **Local Gaming Championships** - Complete tournament management with detailed analytics
- **FIFA Competitions** - Official tiebreaker rules and fair play tracking
- **Gaming Cafes and Lounges** - Professional presentation with real-time updates
- **Community Tournaments** - Easy-to-use admin interface with comprehensive reporting
- **Live Streaming Events** - Detailed statistics and professional appearance for broadcasts
- **Corporate Gaming Events** - Professional tournament management with complete documentation
- **Educational Institutions** - FIFA-compliant system for teaching tournament organization

## 🏆 Professional Tournament Features

### FIFA Compliance
- **Complete Tiebreaker System**: All 8 FIFA criteria implemented in exact order
- **Head-to-Head Calculations**: Automatic H2H record tracking for tied teams
- **Fair Play Points**: Official FIFA disciplinary point system
- **Drawing of Lots**: Final random tiebreaker for completely tied teams

### FC 25 Compatible Statistics
- **Match Statistics**: Goals and disciplinary cards (Yellow/Red cards only)
- **Player Analytics**: Performance metrics, clean sheets, goals per match
- **Disciplinary Tracking**: Yellow cards, red cards, indirect reds with point calculations
- **Head-to-Head Matrix**: Visual comparison of direct match results

### Professional Admin Interface
- **Single Comprehensive Form**: All match statistics in one professional interface
- **Input Validation**: Comprehensive validation for all statistical inputs
- **Real-time Updates**: Immediate reflection of changes across all displays
- **Match Progression**: Automatic tournament stage advancement

### Advanced Display Features
- **Fair Play Rankings**: Separate disciplinary leaderboard
- **Detailed Player Cards**: Individual performance statistics
- **Enhanced Match Cards**: Complete statistical breakdown for each match
- **Responsive Design**: Professional appearance on all devices

### Double Elimination System
- **Upper Bracket**: Winners bracket with automatic progression
- **Lower Bracket**: Elimination bracket for second chances
- **Grand Final**: Championship match with proper seeding
- **Bracket Visualization**: Clear display of tournament progression

---

**Built with ❤️ for the professional gaming community**

*Ready to host your FIFA-compliant professional eFIFA BattleZone tournament!* 🏆⚡
