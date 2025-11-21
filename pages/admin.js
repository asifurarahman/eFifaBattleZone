import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function AdminPanel() {
  const [tournamentData, setTournamentData] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(0);
  const [selectedMatch, setSelectedMatch] = useState('');
  const [homeScore, setHomeScore] = useState('');
  const [awayScore, setAwayScore] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  
  // Only essential FC 25 statistics for tournament progression
  const [homeYellowCards, setHomeYellowCards] = useState('');
  const [homeRedCards, setHomeRedCards] = useState('');
  const [awayYellowCards, setAwayYellowCards] = useState('');
  const [awayRedCards, setAwayRedCards] = useState('');

  // Authenticate admin access
  const authenticateAdmin = async () => {
    if (!username || !password) {
      alert('Please enter both username and password');
      return;
    }

    setIsAuthenticating(true);
    
    try {
      // Test authentication by making a dummy API call
      const response = await fetch('/api/tournament', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa(`${username}:${password}`)
        },
        body: JSON.stringify({
          matchId: 'test',
          homeScore: 0,
          awayScore: 0
        })
      });

      if (response.status === 401) {
        alert('Invalid credentials! Please check your username and password.');
        setIsAuthenticating(false);
        return;
      }

      // If we get here, credentials are valid (even if match ID is invalid)
      // Store credentials in localStorage for subsequent API calls
      localStorage.setItem('adminCredentials', btoa(`${username}:${password}`));
      setIsAuthenticated(true);
      setIsAuthenticating(false);
      
    } catch (error) {
      alert('Authentication failed. Please try again.');
      setIsAuthenticating(false);
    }
  };

  // Logout function
  const logout = () => {
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
    // Clear stored credentials from localStorage
    localStorage.removeItem('adminCredentials');
    clearFormFields();
  };

  // Fetch tournament data
  const fetchTournamentData = async () => {
    try {
      const response = await fetch('/api/tournament');
      const data = await response.json();
      
      if (data.lastUpdate > lastUpdate) {
        setTournamentData(data);
        setLastUpdate(data.lastUpdate);
      }
    } catch (error) {
      console.error('Failed to fetch tournament data:', error);
    }
  };

  // Poll for updates every 5 seconds (less frequent for admin)
  useEffect(() => {
    fetchTournamentData();
    const interval = setInterval(fetchTournamentData, 5000);
    return () => clearInterval(interval);
  }, [lastUpdate]);

  // Clear all form fields
  const clearFormFields = () => {
    setSelectedMatch('');
    setHomeScore('');
    setAwayScore('');
    setHomeYellowCards('');
    setHomeRedCards('');
    setAwayYellowCards('');
    setAwayRedCards('');
  };

  const clearFormInputsOnly = () => {
    setHomeScore('');
    setAwayScore('');
    setHomeYellowCards('');
    setHomeRedCards('');
    setAwayYellowCards('');
    setAwayRedCards('');
  };

  // Update match score with essential statistics only
  const updateScore = async () => {
    if (!selectedMatch || homeScore === '' || awayScore === '') {
      alert('Please select a match and enter both scores');
      return;
    }

    setIsUpdating(true);
    
    try {
      const matchData = {
        matchId: selectedMatch,
        homeScore: parseInt(homeScore),
        awayScore: parseInt(awayScore),
        // Only essential FC 25 disciplinary statistics for Fair Play tiebreaker
        homeYellowCards: parseInt(homeYellowCards) || 0,
        homeRedCards: parseInt(homeRedCards) || 0,
        awayYellowCards: parseInt(awayYellowCards) || 0,
        awayRedCards: parseInt(awayRedCards) || 0
      };

      const storedCredentials = localStorage.getItem('adminCredentials');
      if (!storedCredentials) {
        alert('Authentication expired. Please log in again.');
        logout();
        return;
      }

      const response = await fetch('/api/tournament', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + storedCredentials
        },
        body: JSON.stringify(matchData)
      });

      if (response.status === 401) {
        alert('Invalid credentials!');
        return;
      }

      if (response.ok) {
        alert('Match result updated successfully!');
        clearFormFields();
        fetchTournamentData(); // Immediate refresh
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      alert('Failed to update match result. Please try again.');
      console.error('Update error:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Get available matches for admin (both pending and completed for editing)
  const getAvailableMatches = () => {
    if (!tournamentData) return [];
    
    let availableMatches = [];
    
    if (tournamentData.stage === 'group') {
      // Show both pending and completed matches for editing
      availableMatches = tournamentData.matches;
    } else if (tournamentData.stage === 'playoffs') {
      availableMatches = tournamentData.playoffs;
      
      if (tournamentData.doubleElimination) {
        const upperMatches = (tournamentData.doubleElimination.upperBracket || []);
        const lowerMatches = (tournamentData.doubleElimination.lowerBracket || []);
        
        availableMatches = [...availableMatches, ...upperMatches, ...lowerMatches];
        
        if (tournamentData.doubleElimination.grandFinal) {
          availableMatches.push(tournamentData.doubleElimination.grandFinal);
        }
      }
    }
    
    // Sort matches: pending first, then completed
    return availableMatches.sort((a, b) => {
      if (a.status === 'pending' && b.status === 'completed') return -1;
      if (a.status === 'completed' && b.status === 'pending') return 1;
      return a.id.localeCompare(b.id);
    });
  };

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <>
        <Head>
          <title>Admin Login - eFIFA BattleZone 🎮</title>
          <meta name="description" content="Tournament administration login" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
          <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;600;700&display=swap" rel="stylesheet" />
        </Head>

        <div className="container">
          <div className="login-container">
            <div className="login-card">
              <h1 className="login-title">🛡️ Admin Access</h1>
              <h2 className="login-subtitle">eFIFA BattleZone Tournament Control</h2>
              
              <div className="login-form">
                <div className="form-group">
                  <label>Username:</label>
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter admin username"
                    className="login-input"
                    onKeyPress={(e) => e.key === 'Enter' && authenticateAdmin()}
                  />
                </div>
                
                <div className="form-group">
                  <label>Password:</label>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                    className="login-input"
                    onKeyPress={(e) => e.key === 'Enter' && authenticateAdmin()}
                  />
                </div>
                
                <div className="login-actions">
                  <button 
                    onClick={authenticateAdmin}
                    disabled={isAuthenticating || !username || !password}
                    className="login-btn"
                  >
                    {isAuthenticating ? '🔐 Authenticating...' : '🚀 Login to Admin Panel'}
                  </button>
                  
                  <a href="/" className="back-link">
                    🏠 Back to Tournament
                  </a>
                </div>
              </div>
              
              <div className="login-info">
                <p>🔒 Secure admin access required</p>
                <p>Default: username = <code>admin</code>, password from environment</p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!tournamentData) {
    return (
      <div className="loading">
        <div className="loading-text">🎮 Loading Admin Panel...</div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Admin Panel - eFIFA BattleZone 🎮</title>
        <meta name="description" content="Tournament administration panel" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;600;700&display=swap" rel="stylesheet" />
      </Head>

      <div className="container">
        {/* Header */}
        <header className="tournament-header">
          <div className="title-section">
            <h1 className="main-title">🛡️ Admin Panel</h1>
            <h2 className="subtitle">eFIFA BattleZone Tournament Control</h2>
            <div className="hype-text">🔒 SECURE ACCESS • UPDATE MATCH RESULTS • MANAGE TOURNAMENT 🔒</div>
          </div>
          <div className="admin-nav">
            <a href="/" className="nav-link">🏠 Back to Tournament</a>
            <button onClick={logout} className="logout-btn">🚪 Logout</button>
          </div>
        </header>

        {/* Admin Panel */}
        <section className="admin-main">
          <div className="admin-card">
            <h3>🎮 Match Result Entry</h3>
            <p className="admin-description">
              Enter match results and disciplinary records. Only essential statistics for tournament progression are tracked.
            </p>
            
            {/* Match Selection */}
            <div className="form-group">
              <label>Select Match:</label>
              <select 
                value={selectedMatch} 
                onChange={(e) => {
                  const matchId = e.target.value;
                  setSelectedMatch(matchId);
                  
                  // Pre-fill form if completed match is selected
                  if (matchId) {
                    const match = getAvailableMatches().find(m => m.id === matchId);
                    if (match && match.status === 'completed') {
                      setHomeScore(match.homeScore?.toString() || '');
                      setAwayScore(match.awayScore?.toString() || '');
                      setHomeYellowCards(match.homeYellowCards?.toString() || '0');
                      setHomeRedCards(match.homeRedCards?.toString() || '0');
                      setAwayYellowCards(match.awayYellowCards?.toString() || '0');
                      setAwayRedCards(match.awayRedCards?.toString() || '0');
                    } else {
                      // Clear form inputs for pending matches (but keep match selected)
                      clearFormInputsOnly();
                    }
                  }
                }}
                className="match-selector"
              >
                <option value="">Select Match...</option>
                {getAvailableMatches().map(match => (
                  <option key={match.id} value={match.id}>
                    {match.status === 'completed' ? '✅' : '⏳'} {match.time} - {tournamentData.fighters[match.home]?.name.split(' ')[0]} vs {tournamentData.fighters[match.away]?.name.split(' ')[0]} 
                    {match.group ? ` (Group ${match.group})` : ` (${match.stage})`}
                    {match.status === 'completed' ? ` [${match.homeScore}-${match.awayScore}]` : ''}
                  </option>
                ))}
              </select>
              
              {/* Selected Match Confirmation */}
              {selectedMatch && (
                <div className="selected-match-info">
                  {(() => {
                    const match = getAvailableMatches().find(m => m.id === selectedMatch);
                    if (!match) return null;
                    return (
                      <p className="match-confirmation">
                        📋 Selected: <strong>{tournamentData.fighters[match.home]?.name} vs {tournamentData.fighters[match.away]?.name}</strong>
                        <span className={`match-status ${match.status}`}>
                          {match.status === 'completed' ? ' (Editing)' : ' (New Entry)'}
                        </span>
                      </p>
                    );
                  })()}
                </div>
              )}
            </div>

            {/* Match Result */}
            <div className="form-section">
              <h5>⚽ Match Result</h5>
              <div className="score-inputs">
                <div className="team-score">
                  <label>Home Score:</label>
                  <input 
                    type="number" 
                    value={homeScore}
                    onChange={(e) => setHomeScore(e.target.value)}
                    placeholder="0" 
                    min="0"
                    max="20"
                  />
                </div>
                <div className="vs-divider">VS</div>
                <div className="team-score">
                  <label>Away Score:</label>
                  <input 
                    type="number" 
                    value={awayScore}
                    onChange={(e) => setAwayScore(e.target.value)}
                    placeholder="0" 
                    min="0"
                    max="20"
                  />
                </div>
              </div>
            </div>

            {/* Disciplinary Record - Only for Fair Play Tiebreaker */}
            <div className="form-section">
              <h5>🟨🟥 Disciplinary Record (Fair Play Tiebreaker)</h5>
              <p className="section-note">Only Yellow and Red cards affect tournament standings via Fair Play tiebreaker</p>
              <div className="disciplinary-grid">
                <div className="team-disciplinary">
                  <h6>Home Team</h6>
                  <input 
                    type="number" 
                    value={homeYellowCards}
                    onChange={(e) => setHomeYellowCards(e.target.value)}
                    placeholder="Yellow Cards" 
                    min="0"
                    max="11"
                    title="Yellow cards for Fair Play calculation"
                  />
                  <input 
                    type="number" 
                    value={homeRedCards}
                    onChange={(e) => setHomeRedCards(e.target.value)}
                    placeholder="Red Cards" 
                    min="0"
                    max="11"
                    title="Red cards for Fair Play calculation"
                  />
                </div>
                <div className="team-disciplinary">
                  <h6>Away Team</h6>
                  <input 
                    type="number" 
                    value={awayYellowCards}
                    onChange={(e) => setAwayYellowCards(e.target.value)}
                    placeholder="Yellow Cards" 
                    min="0"
                    max="11"
                    title="Yellow cards for Fair Play calculation"
                  />
                  <input 
                    type="number" 
                    value={awayRedCards}
                    onChange={(e) => setAwayRedCards(e.target.value)}
                    placeholder="Red Cards" 
                    min="0"
                    max="11"
                    title="Red cards for Fair Play calculation"
                  />
                </div>
              </div>
            </div>

            {/* Submit Actions */}
            <div className="form-actions">
              <button 
                onClick={updateScore}
                disabled={isUpdating || !selectedMatch || homeScore === '' || awayScore === ''}
                className="submit-btn"
              >
                {isUpdating ? '⏳ Updating Tournament...' : 
                 (() => {
                   const match = getAvailableMatches().find(m => m.id === selectedMatch);
                   return match?.status === 'completed' ? '✏️ Update Match Result' : '✅ Submit Match Result';
                 })()}
              </button>
              <button 
                onClick={clearFormFields}
                disabled={isUpdating}
                className="clear-btn"
              >
                🗑️ Clear Form
              </button>
            </div>
          </div>

          {/* Tournament Status */}
          <div className="status-card">
            <h4>📊 Tournament Status</h4>
            <div className="status-info">
              <div className="status-item">
                <span className="status-label">Current Stage:</span>
                <span className="status-value">{tournamentData.stage === 'group' ? 'Group Stage' : 'Playoffs'}</span>
              </div>
              <div className="status-item">
                <span className="status-label">Pending Matches:</span>
                <span className="status-value">{getAvailableMatches().length}</span>
              </div>
              <div className="status-item">
                <span className="status-label">Last Update:</span>
                <span className="status-value">{new Date(tournamentData.lastUpdate).toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
