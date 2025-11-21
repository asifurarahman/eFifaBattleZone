import fs from 'fs';
import path from 'path';

const dataFile = path.join(process.cwd(), 'tournament-data.json');

// Initialize tournament data
const initialData = {
  lastUpdate: Date.now(),
  stage: 'group',
  matches: [
    // Group A matches
    {
      id: 'ga1', time: '2:00 PM', home: 'Amlan', away: 'Jacob', group: 'A', 
      homeScore: null, awayScore: null, status: 'pending',
      // Essential FC 25 Statistics (only for tournament progression)
      homeYellowCards: 0, homeRedCards: 0,
      awayYellowCards: 0, awayRedCards: 0,
      venue: 'Main Arena', matchDuration: 10, completedTime: null
    },
    {
      id: 'ga2', time: '2:30 PM', home: 'Pritul', away: 'Asifur', group: 'A',
      homeScore: null, awayScore: null, status: 'pending',
      homeYellowCards: 0, homeRedCards: 0,
      awayYellowCards: 0, awayRedCards: 0,
      venue: 'Main Arena', matchDuration: 10,
      kickoffTime: null, completedTime: null
    },
    {
      id: 'ga3', time: '3:00 PM', home: 'Amlan', away: 'Pritul', group: 'A',
      homeScore: null, awayScore: null, status: 'pending',
      homeYellowCards: 0, homeRedCards: 0,
      awayYellowCards: 0, awayRedCards: 0,
      venue: 'Main Arena', matchDuration: 10,
      kickoffTime: null, completedTime: null
    },
    {
      id: 'ga4', time: '3:30 PM', home: 'Jacob', away: 'Asifur', group: 'A',
      homeScore: null, awayScore: null, status: 'pending',
      homeYellowCards: 0, homeRedCards: 0,
      awayYellowCards: 0, awayRedCards: 0,
      venue: 'Main Arena', matchDuration: 10,
      kickoffTime: null, completedTime: null
    },
    {
      id: 'ga5', time: '4:00 PM', home: 'Amlan', away: 'Asifur', group: 'A',
      homeScore: null, awayScore: null, status: 'pending',
      homeYellowCards: 0, homeRedCards: 0,
      awayYellowCards: 0, awayRedCards: 0,
      venue: 'Main Arena', matchDuration: 10,
      kickoffTime: null, completedTime: null
    },
    {
      id: 'ga6', time: '4:30 PM', home: 'Jacob', away: 'Pritul', group: 'A',
      homeScore: null, awayScore: null, status: 'pending',
      homeYellowCards: 0, homeRedCards: 0,
      awayYellowCards: 0, awayRedCards: 0,
      venue: 'Main Arena', matchDuration: 10,
      kickoffTime: null, completedTime: null
    },
    
    // Group B matches
    {
      id: 'gb1', time: '2:15 PM', home: 'Wasif', away: 'Swapnil', group: 'B',
      homeScore: null, awayScore: null, status: 'pending',
      homeYellowCards: 0, homeRedCards: 0,
      awayYellowCards: 0, awayRedCards: 0,
      venue: 'Main Arena', matchDuration: 10,
      kickoffTime: null, completedTime: null
    },
    {
      id: 'gb2', time: '2:45 PM', home: 'Showrin', away: 'Qazi', group: 'B',
      homeScore: null, awayScore: null, status: 'pending',
      homeYellowCards: 0, homeRedCards: 0,
      awayYellowCards: 0, awayRedCards: 0,
      venue: 'Main Arena', matchDuration: 10,
      kickoffTime: null, completedTime: null
    },
    {
      id: 'gb3', time: '3:15 PM', home: 'Wasif', away: 'Showrin', group: 'B',
      homeScore: null, awayScore: null, status: 'pending',
      homeYellowCards: 0, homeRedCards: 0,
      awayYellowCards: 0, awayRedCards: 0,
      venue: 'Main Arena', matchDuration: 10,
      kickoffTime: null, completedTime: null
    },
    {
      id: 'gb4', time: '3:45 PM', home: 'Swapnil', away: 'Qazi', group: 'B',
      homeScore: null, awayScore: null, status: 'pending',
      homeYellowCards: 0, homeRedCards: 0,
      awayYellowCards: 0, awayRedCards: 0,
      venue: 'Main Arena', matchDuration: 10,
      kickoffTime: null, completedTime: null
    },
    {
      id: 'gb5', time: '4:15 PM', home: 'Wasif', away: 'Qazi', group: 'B',
      homeScore: null, awayScore: null, status: 'pending',
      homeYellowCards: 0, homeRedCards: 0,
      awayYellowCards: 0, awayRedCards: 0,
      venue: 'Main Arena', matchDuration: 10,
      kickoffTime: null, completedTime: null
    },
    {
      id: 'gb6', time: '4:45 PM', home: 'Swapnil', away: 'Showrin', group: 'B',
      homeScore: null, awayScore: null, status: 'pending',
      homeYellowCards: 0, homeRedCards: 0,
      awayYellowCards: 0, awayRedCards: 0,
      venue: 'Main Arena', matchDuration: 10,
      kickoffTime: null, completedTime: null
    }
  ],
  fighters: {
    // Group A
    'Amlan': {
      name: 'Amlan Dipra Das', icon: '🎯', group: 'A',
      // Match record
      points: 0, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0,
      // Essential FC 25 disciplinary record (for Fair Play tiebreaker)
      yellowCards: 0, redCards: 0, fairPlayPoints: 0,
      // Display stats for player cards
      biggestWin: null, biggestWinMargin: 0, biggestLoss: null, biggestLossMargin: 0
    },
    'Pritul': {
      name: 'Shaiuf Sadique Pritul', icon: '⚡', group: 'A',
      points: 0, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0,
      yellowCards: 0, redCards: 0, fairPlayPoints: 0,
      biggestWin: null, biggestWinMargin: 0, biggestLoss: null, biggestLossMargin: 0
    },
    'Jacob': {
      name: 'Jacob', icon: '🚀', group: 'A',
      points: 0, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0,
      yellowCards: 0, redCards: 0, fairPlayPoints: 0,
      biggestWin: null, biggestWinMargin: 0, biggestLoss: null, biggestLossMargin: 0
    },
    'Asifur': {
      name: 'Asifur Rahman', icon: '💥', group: 'A',
      points: 0, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0,
      yellowCards: 0, redCards: 0, fairPlayPoints: 0,
      biggestWin: null, biggestWinMargin: 0, biggestLoss: null, biggestLossMargin: 0
    },
    
    // Group B
    'Wasif': {
      name: 'Wasif Azmaeen', icon: '🎮', group: 'B',
      points: 0, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0,
      yellowCards: 0, redCards: 0, fairPlayPoints: 0,
      biggestWin: null, biggestWinMargin: 0, biggestLoss: null, biggestLossMargin: 0
    },
    'Swapnil': {
      name: 'Swapnil Sharma Sarker', icon: '🏹', group: 'B',
      points: 0, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0,
      yellowCards: 0, redCards: 0, fairPlayPoints: 0,
      biggestWin: null, biggestWinMargin: 0, biggestLoss: null, biggestLossMargin: 0
    },
    'Showrin': {
      name: 'Showrin Barua', icon: '⭐', group: 'B',
      points: 0, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0,
      yellowCards: 0, redCards: 0, fairPlayPoints: 0,
      biggestWin: null, biggestWinMargin: 0, biggestLoss: null, biggestLossMargin: 0
    },
    'Qazi': {
      name: 'Qazi Taskin', icon: '🔥', group: 'B',
      points: 0, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0,
      yellowCards: 0, redCards: 0, fairPlayPoints: 0,
      biggestWin: null, biggestWinMargin: 0, biggestLoss: null, biggestLossMargin: 0
    }
  },
  playoffs: [],
  doubleElimination: {
    upperBracket: [],
    lowerBracket: [],
    grandFinal: null,
    eliminated: []
  },
  champions: {
    champion: null,
    runnerup: null,
    thirdplace: null
  },
  // Tournament metadata
  tournamentInfo: {
    name: 'eFIFA BattleZone Season 1',
    format: 'Group Stage + Double Elimination',
    startTime: '2:00 PM',
    endTime: '6:15 PM',
    venue: 'Main Arena',
    organizer: 'Tournament Admin'
  }
};

// Initialize data file if it doesn't exist
function initializeData() {
  if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, JSON.stringify(initialData, null, 2));
  }
}

// Update fighter statistics - Essential stats for tournament progression
function updateFighterStats(fighters, fighterId, matchStats, opponentId) {
  const fighter = fighters[fighterId];
  const opponent = fighters[opponentId];
  if (!fighter || !opponent) return;
  
  const { goalsFor, goalsAgainst, yellowCards = 0, redCards = 0 } = matchStats;
  
  // Basic match record
  fighter.played++;
  fighter.gf += parseInt(goalsFor);
  fighter.ga += parseInt(goalsAgainst);
  
  // Points calculation
  if (goalsFor > goalsAgainst) {
    fighter.won++;
    fighter.points += 3;
  } else if (goalsFor === goalsAgainst) {
    fighter.drawn++;
    fighter.points += 1;
  } else {
    fighter.lost++;
  }
  
  // FC 25 disciplinary record (only Yellow and Red cards for Fair Play)
  fighter.yellowCards += parseInt(yellowCards);
  fighter.redCards += parseInt(redCards);
  fighter.fairPlayPoints += (yellowCards * 1) + (redCards * 4);
  
  // Track biggest wins and losses for display
  const goalDifference = parseInt(goalsFor) - parseInt(goalsAgainst);
  const scoreText = `${goalsFor}-${goalsAgainst} vs ${opponent.name.split(' ')[0]}`;
  
  if (goalDifference > 0) {
    // This is a win - check if it's the biggest
    if (!fighter.biggestWin || goalDifference > fighter.biggestWinMargin) {
      fighter.biggestWin = scoreText;
      fighter.biggestWinMargin = goalDifference;
    }
  } else if (goalDifference < 0) {
    // This is a loss - check if it's the biggest
    if (!fighter.biggestLoss || Math.abs(goalDifference) > Math.abs(fighter.biggestLossMargin || 0)) {
      fighter.biggestLoss = scoreText;
      fighter.biggestLossMargin = goalDifference;
    }
  }
}

// Calculate head-to-head record between two fighters
function getHeadToHeadRecord(fighterA, fighterB, matches) {
  const h2hMatches = matches.filter(match => 
    match.status === 'completed' &&
    ((match.home === fighterA && match.away === fighterB) ||
     (match.home === fighterB && match.away === fighterA))
  );
  
  let pointsA = 0, pointsB = 0, gfA = 0, gfB = 0, gaA = 0, gaB = 0;
  
  h2hMatches.forEach(match => {
    if (match.home === fighterA) {
      gfA += match.homeScore;
      gaA += match.awayScore;
      gfB += match.awayScore;
      gaB += match.homeScore;
      
      if (match.homeScore > match.awayScore) pointsA += 3;
      else if (match.homeScore === match.awayScore) { pointsA += 1; pointsB += 1; }
      else pointsB += 3;
    } else {
      gfA += match.awayScore;
      gaA += match.homeScore;
      gfB += match.homeScore;
      gaB += match.awayScore;
      
      if (match.awayScore > match.homeScore) pointsA += 3;
      else if (match.awayScore === match.homeScore) { pointsA += 1; pointsB += 1; }
      else pointsB += 3;
    }
  });
  
  return {
    pointsA, pointsB,
    gdA: gfA - gaA, gdB: gfB - gaB,
    gfA, gfB
  };
}

// Recalculate all fighter stats from scratch (used when editing completed matches)
function recalculateAllFighterStats(data) {
  // Reset all fighter stats
  Object.values(data.fighters).forEach(fighter => {
    fighter.points = 0;
    fighter.played = 0;
    fighter.won = 0;
    fighter.drawn = 0;
    fighter.lost = 0;
    fighter.gf = 0;
    fighter.ga = 0;
    fighter.yellowCards = 0;
    fighter.redCards = 0;
    fighter.fairPlayPoints = 0;
    fighter.biggestWin = null;
    fighter.biggestWinMargin = 0;
    fighter.biggestLoss = null;
    fighter.biggestLossMargin = 0;
  });
  
  // Recalculate from all completed matches
  const allMatches = [
    ...data.matches.filter(m => m.status === 'completed'),
    ...data.playoffs.filter(m => m.status === 'completed'),
    ...(data.doubleElimination?.upperBracket || []).filter(m => m.status === 'completed'),
    ...(data.doubleElimination?.lowerBracket || []).filter(m => m.status === 'completed')
  ];
  
  if (data.doubleElimination?.grandFinal?.status === 'completed') {
    allMatches.push(data.doubleElimination.grandFinal);
  }
  
  // Process each completed match
  allMatches.forEach(match => {
    const homeStats = {
      goalsFor: match.homeScore,
      goalsAgainst: match.awayScore,
      yellowCards: match.homeYellowCards || 0,
      redCards: match.homeRedCards || 0
    };
    
    const awayStats = {
      goalsFor: match.awayScore,
      goalsAgainst: match.homeScore,
      yellowCards: match.awayYellowCards || 0,
      redCards: match.awayRedCards || 0
    };
    
    updateFighterStats(data.fighters, match.home, homeStats, match.away);
    updateFighterStats(data.fighters, match.away, awayStats, match.home);
  });
}

// Check if group stage is complete and generate playoffs
function checkGroupStageComplete(data) {
  const groupAMatches = data.matches.filter(m => m.group === 'A');
  const groupBMatches = data.matches.filter(m => m.group === 'B');
  
  const groupAComplete = groupAMatches.every(m => m.status === 'completed');
  const groupBComplete = groupBMatches.every(m => m.status === 'completed');
  
  if (groupAComplete && groupBComplete && data.stage === 'group') {
    // Generate double elimination bracket
    generateDoubleEliminationBracket(data);
    data.stage = 'playoffs';
  }
}

// Generate double elimination bracket from group results
function generateDoubleEliminationBracket(data) {
  const groupAFighters = getFIFASortedFighters(data.fighters, 'A', data.matches);
  const groupBFighters = getFIFASortedFighters(data.fighters, 'B', data.matches);
  
  // Top 2 from each group advance
  const A1 = groupAFighters[0]?.key;
  const A2 = groupAFighters[1]?.key;
  const B1 = groupBFighters[0]?.key;
  const B2 = groupBFighters[1]?.key;
  
  if (!A1 || !A2 || !B1 || !B2) return;
  
  // Create upper bracket matches
  const upperBracket = [
    {
      id: 'us1', time: '5:00 PM', home: A1, away: B2, 
      stage: 'Upper Semi 1', round: 1, bracket: 'upper',
      homeScore: null, awayScore: null, status: 'pending',
      homeYellowCards: 0, homeRedCards: 0,
      awayYellowCards: 0, awayRedCards: 0,
      venue: 'Main Arena', matchDuration: 10,
      kickoffTime: null, completedTime: null
    },
    {
      id: 'us2', time: '5:15 PM', home: B1, away: A2,
      stage: 'Upper Semi 2', round: 1, bracket: 'upper',
      homeScore: null, awayScore: null, status: 'pending',
      homeYellowCards: 0, homeRedCards: 0,
      awayYellowCards: 0, awayRedCards: 0,
      venue: 'Main Arena', matchDuration: 10,
      kickoffTime: null, completedTime: null
    }
  ];
  
  data.doubleElimination = {
    upperBracket: upperBracket,
    lowerBracket: [],
    grandFinal: null,
    eliminated: []
  };
  
  // Initialize playoffs array for backward compatibility
  data.playoffs = [...upperBracket];
}

// Progress double elimination bracket when matches are completed
function progressDoubleElimination(data, completedMatch) {
  if (!data.doubleElimination) return;
  
  const { upperBracket, lowerBracket } = data.doubleElimination;
  
  // Handle upper bracket progression
  if (completedMatch.bracket === 'upper') {
    const completedUpperSemis = upperBracket.filter(m => 
      m.stage.includes('Semi') && m.status === 'completed'
    );
    
    if (completedUpperSemis.length === 2) {
      // Create lower bracket match with losers
      const losers = completedUpperSemis.map(m =>
        m.homeScore > m.awayScore ? m.away : m.home
      );
      
      lowerBracket.push({
        id: 'ls1', time: '5:30 PM', home: losers[0], away: losers[1],
        stage: 'Lower Semi', round: 1, bracket: 'lower',
        homeScore: null, awayScore: null, status: 'pending',
        homeYellowCards: 0, homeRedCards: 0,
        awayYellowCards: 0, awayRedCards: 0,
        venue: 'Main Arena', matchDuration: 10,
        kickoffTime: null, completedTime: null
      });
      
      // Create upper final
      const winners = completedUpperSemis.map(m =>
        m.homeScore > m.awayScore ? m.home : m.away
      );
      
      upperBracket.push({
        id: 'uf1', time: '5:45 PM', home: winners[0], away: winners[1],
        stage: 'Upper Final', round: 2, bracket: 'upper',
        homeScore: null, awayScore: null, status: 'pending',
        homeYellowCards: 0, homeRedCards: 0,
        awayYellowCards: 0, awayRedCards: 0,
        venue: 'Main Arena', matchDuration: 10,
        kickoffTime: null, completedTime: null
      });
      
      // Update playoffs array for backward compatibility
      data.playoffs = [...upperBracket, ...lowerBracket];
    }
  }
  
  // Handle lower bracket and grand final progression
  const upperFinal = upperBracket.find(m => m.stage === 'Upper Final');
  const lowerSemi = lowerBracket.find(m => m.stage === 'Lower Semi');
  
  if (upperFinal?.status === 'completed' && lowerSemi?.status === 'completed') {
    const upperWinner = upperFinal.homeScore > upperFinal.awayScore ? 
      upperFinal.home : upperFinal.away;
    const upperLoser = upperFinal.homeScore > upperFinal.awayScore ? 
      upperFinal.away : upperFinal.home;
    const lowerWinner = lowerSemi.homeScore > lowerSemi.awayScore ? 
      lowerSemi.home : lowerSemi.away;
    
    // Create lower final
    if (!lowerBracket.find(m => m.stage === 'Lower Final')) {
      lowerBracket.push({
        id: 'lf1', time: '6:00 PM', home: upperLoser, away: lowerWinner,
        stage: 'Lower Final', round: 2, bracket: 'lower',
        homeScore: null, awayScore: null, status: 'pending',
        homeYellowCards: 0, homeRedCards: 0,
        awayYellowCards: 0, awayRedCards: 0,
        venue: 'Main Arena', matchDuration: 10,
        kickoffTime: null, completedTime: null
      });
    }
    
    const lowerFinal = lowerBracket.find(m => m.stage === 'Lower Final');
    if (lowerFinal?.status === 'completed') {
      const lowerChampion = lowerFinal.homeScore > lowerFinal.awayScore ? 
        lowerFinal.home : lowerFinal.away;
      
      // Create grand final
      data.doubleElimination.grandFinal = {
        id: 'gf1', time: '6:15 PM', home: upperWinner, away: lowerChampion,
        stage: 'Grand Final', round: 3, bracket: 'final',
        homeScore: null, awayScore: null, status: 'pending',
        homeYellowCards: 0, homeRedCards: 0,
        awayYellowCards: 0, awayRedCards: 0,
        venue: 'Main Arena', matchDuration: 10,
        kickoffTime: null, completedTime: null
      };
    }
  }
  
  // Update playoffs array
  data.playoffs = [...upperBracket, ...lowerBracket];
  if (data.doubleElimination.grandFinal) {
    data.playoffs.push(data.doubleElimination.grandFinal);
  }
}

// FIFA-compliant sorting function
function getFIFASortedFighters(fighters, group, matches) {
  return Object.entries(fighters)
    .filter(([key, fighter]) => fighter.group === group)
    .map(([key, fighter]) => ({ ...fighter, key }))
    .sort((a, b) => {
      // 1. Points in all group matches
      if (b.points !== a.points) return b.points - a.points;
      
      // 2. Goal difference in all group matches
      const aGD = a.gf - a.ga;
      const bGD = b.gf - b.ga;
      if (bGD !== aGD) return bGD - aGD;
      
      // 3. Goals scored in all group matches
      if (b.gf !== a.gf) return b.gf - a.gf;
      
      // 4-6. Head-to-head comparison (only if tied on above 3 criteria)
      if (a.points === b.points && aGD === bGD && a.gf === b.gf) {
        const h2h = getHeadToHeadRecord(a.key, b.key, matches);
        
        // 4. Points in head-to-head matches
        if (h2h.pointsB !== h2h.pointsA) return h2h.pointsB - h2h.pointsA;
        
        // 5. Goal difference in head-to-head matches
        if (h2h.gdB !== h2h.gdA) return h2h.gdB - h2h.gdA;
        
        // 6. Goals scored in head-to-head matches
        if (h2h.gfB !== h2h.gfA) return h2h.gfB - h2h.gfA;
      }
      
      // 7. Fair play points (LOWER is better - fewer disciplinary points)
      if (a.fairPlayPoints !== b.fairPlayPoints) return a.fairPlayPoints - b.fairPlayPoints;
      
      // 8. Drawing of lots - Use consistent alphabetical order for UI stability
      return a.name.localeCompare(b.name);
    });
}

// Authentication check function
function checkAuth(authHeader) {
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return false;
  }
  
  const credentials = Buffer.from(authHeader.slice(6), 'base64').toString('ascii');
  const [username, password] = credentials.split(':');
  
  // Check against environment variables or default values
  const validUsername = process.env.ADMIN_USERNAME || 'admin';
  const validPassword = process.env.ADMIN_PASSWORD || 'admin';
  
  return username === validUsername && password === validPassword;
}

export default function handler(req, res) {
  // Initialize data file
  initializeData();
  
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    // Public endpoint - anyone can read tournament data
    try {
      const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
      return res.status(200).json(data);
    } catch (error) {
      console.error('Error reading tournament data:', error);
      return res.status(500).json({ error: 'Failed to load tournament data' });
    }
  }

  if (req.method === 'POST') {
    // Admin only - check basic auth
    const authHeader = req.headers.authorization;
    
    if (!checkAuth(authHeader)) {
      res.setHeader('WWW-Authenticate', 'Basic realm="Tournament Admin"');
      return res.status(401).json({ error: 'Authentication required' });
    }

    try {
      const {
        matchId, homeScore, awayScore,
        homeYellowCards = 0, homeRedCards = 0,
        awayYellowCards = 0, awayRedCards = 0
      } = req.body;
      
      if (!matchId || homeScore === undefined || awayScore === undefined) {
        return res.status(400).json({ error: 'Missing required fields: matchId, homeScore, awayScore' });
      }
      
      const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
      
      // Find match in group matches, playoffs, or double elimination brackets
      let match = data.matches.find(m => m.id === matchId);
      if (!match) {
        match = data.playoffs.find(m => m.id === matchId);
      }
      if (!match && data.doubleElimination) {
        match = [...(data.doubleElimination.upperBracket || []), ...(data.doubleElimination.lowerBracket || [])]
          .find(m => m.id === matchId);
      }
      
      if (!match) {
        return res.status(404).json({ error: 'Match not found' });
      }
      
      // If this is an update to a completed match, we need to recalculate all stats
      const isUpdate = match.status === 'completed';
      
      // Update match with essential statistics
      match.homeScore = parseInt(homeScore);
      match.awayScore = parseInt(awayScore);
      match.status = 'completed';
      match.completedTime = new Date().toISOString();
      
      // Update disciplinary statistics (FC 25 cards only)
      match.homeYellowCards = parseInt(homeYellowCards);
      match.homeRedCards = parseInt(homeRedCards);
      match.awayYellowCards = parseInt(awayYellowCards);
      match.awayRedCards = parseInt(awayRedCards);
      
      // Update fighter stats with essential tournament data
      const homeStats = {
        goalsFor: homeScore, goalsAgainst: awayScore,
        yellowCards: homeYellowCards, redCards: homeRedCards
      };
      
      const awayStats = {
        goalsFor: awayScore, goalsAgainst: homeScore,
        yellowCards: awayYellowCards, redCards: awayRedCards
      };
      
      // If this is an update to a completed match, recalculate all stats from scratch
      if (isUpdate) {
        recalculateAllFighterStats(data);
      } else {
        // For new matches, just update the two fighters involved
        updateFighterStats(data.fighters, match.home, homeStats, match.away);
        updateFighterStats(data.fighters, match.away, awayStats, match.home);
      }
      
      // Check for tournament progression
      if (match.group) {
        checkGroupStageComplete(data);
      } else if (match.bracket) {
        progressDoubleElimination(data, match);
      }
      
      data.lastUpdate = Date.now();
      fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
      
      return res.status(200).json({ success: true, message: 'Score updated successfully' });
      
    } catch (error) {
      console.error('Error updating score:', error);
      return res.status(500).json({ error: 'Failed to update score' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
