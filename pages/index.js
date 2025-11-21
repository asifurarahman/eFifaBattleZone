import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Tournament() {
  const [tournamentData, setTournamentData] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(0);
  const [showAdmin, setShowAdmin] = useState(false);
  

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

  // Poll for updates every 2 seconds
  useEffect(() => {
    fetchTournamentData();
    const interval = setInterval(fetchTournamentData, 2000);
    return () => clearInterval(interval);
  }, [lastUpdate]);

  // Calculate head-to-head record between two fighters
  const getHeadToHeadRecord = (fighterA, fighterB, matches) => {
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
  };





  // FIFA-compliant sorting function for fighters
  const getSortedFighters = (group) => {
    if (!tournamentData) return [];
    
    const fighters = Object.entries(tournamentData.fighters)
      .filter(([key, fighter]) => fighter.group === group)
      .map(([key, fighter]) => ({ ...fighter, key }));
    
    return fighters.sort((a, b) => {
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
        const h2h = getHeadToHeadRecord(a.key, b.key, tournamentData.matches);
        
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
  };

  // Get current stage text
  const getCurrentStageText = () => {
    if (!tournamentData) return 'Loading...';
    
    if (tournamentData.stage === 'group') {
      const completed = tournamentData.matches.filter(m => m.status === 'completed').length;
      const total = tournamentData.matches.length;
      return `Group Stage: ${completed}/${total} matches completed`;
    } else if (tournamentData.stage === 'playoffs') {
      return 'Double Elimination Playoffs';
    }
    
    return 'Tournament';
  };

  if (!tournamentData) {
    return (
      <div className="loading">
        <div className="loading-text">🎮 Loading eFIFA BattleZone...</div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>eFIFA BattleZone Season 1 🎮</title>
        <meta name="description" content="Live tournament bracket and scores" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;600;700&display=swap" rel="stylesheet" />
      </Head>

      <div className="container">
        {/* Header */}
        <header className="tournament-header">
          <div className="title-section">
            <h1 className="main-title">🎮 eFIFA BattleZone 🏆</h1>
            <h2 className="subtitle">Season 1 Championship</h2>
            <div className="hype-text">🔥 FIGHT FOR GLORY • CLAIM THE CROWN • BECOME THE CHAMPION 🔥</div>
          </div>
          <div className="tournament-info">
            <div className="info-card">
              <span className="info-label">Format:</span>
              <span className="info-value">Group Stage → Double Elimination</span>
            </div>
            <div className="info-card">
              <span className="info-label">Stage:</span>
              <span className="info-value">{getCurrentStageText()}</span>
            </div>
            <div className="info-card">
              <span className="info-label">Fighters:</span>
              <span className="info-value">8 Players</span>
            </div>
          </div>
        </header>

        {/* Live Status */}
        <section className="live-status">
          <div className="status-indicator">
            <span className="live-dot"></span>
            <span className="status-text">TOURNAMENT LIVE</span>
          </div>
          <div className="current-stage">{getCurrentStageText()}</div>
        </section>

        {/* Groups */}
        <section className="groups-section">
          <h2 className="section-title">⚔️ THE FIGHTERS</h2>
          
          <div className="groups-container">
            {/* Group A */}
            <div className="group-card">
              <h3 className="group-title">🔥 Group A Warriors</h3>
              <div className="fighters-list">
                {getSortedFighters('A').map((fighter, index) => (
                  <div key={fighter.key} className={`fighter-card ${index < 2 ? 'qualified' : ''}`}>
                    <span className="fighter-icon">{fighter.icon}</span>
                    <span className="fighter-name">{fighter.name}</span>
                    {index < 2 && <span className="qualified-badge">✓</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* Group B */}
            <div className="group-card">
              <h3 className="group-title">🛡️ Group B Legends</h3>
              <div className="fighters-list">
                {getSortedFighters('B').map((fighter, index) => (
                  <div key={fighter.key} className={`fighter-card ${index < 2 ? 'qualified' : ''}`}>
                    <span className="fighter-icon">{fighter.icon}</span>
                    <span className="fighter-name">{fighter.name}</span>
                    {index < 2 && <span className="qualified-badge">✓</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Standings */}
        <section className="standings-section">
          <h2 className="section-title">🏆 LIVE STANDINGS</h2>
          
          <div className="standings-container">
            {/* Group A Standings */}
            <div className="standings-card">
              <h3 className="standings-title">Group A Leaderboard</h3>
              <table className="standings-table">
                <thead>
                  <tr>
                    <th>Pos</th>
                    <th>Fighter</th>
                    <th>P</th>
                    <th>W</th>
                    <th>D</th>
                    <th>L</th>
                    <th>GF</th>
                    <th>GA</th>
                    <th>GD</th>
                    <th>Pts</th>
                    <th>🟨</th>
                    <th>🟥</th>
                    <th>FP</th>
                    <th>CS</th>
                  </tr>
                </thead>
                <tbody>
                  {getSortedFighters('A').map((fighter, index) => (
                    <tr key={fighter.key} className={`fighter-row ${index < 2 ? 'qualified' : ''}`}>
                      <td className="position">{index + 1}</td>
                      <td className="fighter-name-cell">{fighter.icon} {fighter.name.split(' ')[0]}</td>
                      <td>{fighter.played}</td>
                      <td>{fighter.won}</td>
                      <td>{fighter.drawn}</td>
                      <td>{fighter.lost}</td>
                      <td>{fighter.gf}</td>
                      <td>{fighter.ga}</td>
                      <td>{fighter.gf - fighter.ga > 0 ? '+' : ''}{fighter.gf - fighter.ga}</td>
                      <td className="points">{fighter.points}</td>
                      <td className="yellow-cards">{fighter.yellowCards || 0}</td>
                      <td className="red-cards">{fighter.redCards || 0}</td>
                      <td className="fair-play">{fighter.fairPlayPoints || 0}</td>
                      <td className="clean-sheets">{fighter.cleanSheets || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Group B Standings */}
            <div className="standings-card">
              <h3 className="standings-title">Group B Leaderboard</h3>
              <table className="standings-table">
                <thead>
                  <tr>
                    <th>Pos</th>
                    <th>Fighter</th>
                    <th>P</th>
                    <th>W</th>
                    <th>D</th>
                    <th>L</th>
                    <th>GF</th>
                    <th>GA</th>
                    <th>GD</th>
                    <th>Pts</th>
                    <th>🟨</th>
                    <th>🟥</th>
                    <th>FP</th>
                    <th>CS</th>
                  </tr>
                </thead>
                <tbody>
                  {getSortedFighters('B').map((fighter, index) => (
                    <tr key={fighter.key} className={`fighter-row ${index < 2 ? 'qualified' : ''}`}>
                      <td className="position">{index + 1}</td>
                      <td className="fighter-name-cell">{fighter.icon} {fighter.name.split(' ')[0]}</td>
                      <td>{fighter.played}</td>
                      <td>{fighter.won}</td>
                      <td>{fighter.drawn}</td>
                      <td>{fighter.lost}</td>
                      <td>{fighter.gf}</td>
                      <td>{fighter.ga}</td>
                      <td>{fighter.gf - fighter.ga > 0 ? '+' : ''}{fighter.gf - fighter.ga}</td>
                      <td className="points">{fighter.points}</td>
                      <td className="yellow-cards">{fighter.yellowCards || 0}</td>
                      <td className="red-cards">{fighter.redCards || 0}</td>
                      <td className="fair-play">{fighter.fairPlayPoints || 0}</td>
                      <td className="clean-sheets">{fighter.cleanSheets || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Fair Play Rankings */}
        <section className="fair-play-section">
          <h2 className="section-title">🏅 FC 25 FAIR PLAY RANKINGS</h2>
          <div className="fair-play-explanation">
            <p>Lower Fair Play Points = Better Ranking • Yellow Card = 1pt • Red Card = 4pts (FC 25 Game Cards Only)</p>
          </div>
          
          <div className="fair-play-container">
            <div className="fair-play-card">
              <h3 className="fair-play-title">🥇 Fair Play Leaderboard</h3>
              <table className="fair-play-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Player</th>
                    <th>🟨 Yellow</th>
                    <th>🟥 Red</th>
                    <th>📊 FP Points</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(tournamentData.fighters)
                    .map(([key, fighter]) => ({ ...fighter, key }))
                    .sort((a, b) => (a.fairPlayPoints || 0) - (b.fairPlayPoints || 0))
                    .map((fighter, index) => (
                      <tr key={fighter.key} className={`fair-play-row ${index === 0 ? 'best-behavior' : ''}`}>
                        <td className="rank">{index + 1}</td>
                        <td className="player-name">{fighter.icon} {fighter.name.split(' ')[0]}</td>
                        <td className="yellow-stat">{fighter.yellowCards || 0}</td>
                        <td className="red-stat">{fighter.redCards || 0}</td>
                        <td className="fp-points">{fighter.fairPlayPoints || 0}</td>
                        <td className="behavior-status">
                          {(fighter.fairPlayPoints || 0) === 0 ? '✨ Perfect' : 
                           (fighter.fairPlayPoints || 0) <= 2 ? '👍 Good' : 
                           (fighter.fairPlayPoints || 0) <= 5 ? '⚠️ Caution' : '🚨 Poor'}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Detailed Player Statistics */}
        <section className="player-stats-section">
          <h2 className="section-title">📊 DETAILED PLAYER STATISTICS</h2>
          
          <div className="player-stats-container">
            {Object.entries(tournamentData.fighters)
              .map(([key, fighter]) => ({ ...fighter, key }))
              .sort((a, b) => b.points - a.points)
              .map(fighter => (
                <div key={fighter.key} className="player-stat-card">
                  <div className="player-header">
                    <span className="player-icon">{fighter.icon}</span>
                    <div className="player-info">
                      <h4 className="player-name">{fighter.name}</h4>
                      <span className="player-group">Group {fighter.group}</span>
                    </div>
                    <div className="player-points">
                      {fighter.points} pts
                    </div>
                  </div>
                  
                  <div className="stats-grid-detailed">
                    <div className="stat-item">
                      <span className="stat-label">Points</span>
                      <span className="stat-value points">{fighter.points}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Goals/Match</span>
                      <span className="stat-value">{fighter.goalsPerMatch || '0.00'}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Clean Sheets</span>
                      <span className="stat-value clean">{fighter.cleanSheets || 0}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Fair Play</span>
                      <span className="stat-value fair-play">{fighter.fairPlayPoints || 0} pts</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Discipline</span>
                      <span className="stat-value cards">🟨{fighter.yellowCards || 0} 🟥{fighter.redCards || 0}</span>
                    </div>
                  </div>
                  
                  {fighter.biggestWin && (
                    <div className="achievement">
                      <span className="achievement-label">Biggest Win:</span>
                      <span className="achievement-value win">{fighter.biggestWin}</span>
                    </div>
                  )}
                  
                  {fighter.biggestLoss && (
                    <div className="achievement">
                      <span className="achievement-label">Biggest Loss:</span>
                      <span className="achievement-value loss">{fighter.biggestLoss}</span>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </section>

        {/* Head-to-Head Records */}
        <section className="h2h-section">
          <h2 className="section-title">⚔️ HEAD-TO-HEAD RECORDS</h2>
          <div className="h2h-explanation">
            <p>Direct match results between players (used for FIFA tiebreaking)</p>
            <p><strong>Matrix Guide:</strong> Row shows player, Column shows opponent. Cell shows result from row player's perspective.</p>
            <p><strong>Example:</strong> If Player1 beat Player2 (2-1), then (Player1, Player2) = "2-1" and (Player2, Player1) = "1-2"</p>
          </div>
          
          <div className="h2h-container">
            {['A', 'B'].map(group => (
              <div key={group} className="h2h-group">
                <h3 className="h2h-group-title">Group {group} Head-to-Head Matrix</h3>
                <div className="h2h-matrix">
                  {/* Header row with player names */}
                  <div className="h2h-row h2h-header">
                    <div className="h2h-player">vs</div>
                    {getSortedFighters(group).map(opponent => (
                      <div key={opponent.key} className="h2h-cell header">
                        {opponent.icon} {opponent.name.split(' ')[0]}
                      </div>
                    ))}
                  </div>
                  
                  {/* Matrix rows */}
                  {getSortedFighters(group).map(fighter => (
                    <div key={fighter.key} className="h2h-row">
                      <div className="h2h-player">{fighter.icon} {fighter.name.split(' ')[0]}</div>
                      {getSortedFighters(group).map(opponent => {
                        if (fighter.key === opponent.key) {
                          return <div key={opponent.key} className="h2h-cell self">-</div>;
                        }
                        
                        const h2h = getHeadToHeadRecord(fighter.key, opponent.key, tournamentData.matches);
                        const hasPlayed = h2h.pointsA + h2h.pointsB > 0;
                        
                        return (
                          <div key={opponent.key} className={`h2h-cell ${hasPlayed ? 'played' : 'pending'}`}>
                            {hasPlayed ? (
                              <div className="h2h-result">
                                <div className="h2h-score">{h2h.gfA}-{h2h.gfB}</div>
                                <div className="h2h-points">{h2h.pointsA}pts</div>
                              </div>
                            ) : (
                              <span className="not-played">-</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Matches */}
        <section className="matches-section">
          <h2 className="section-title">⚔️ BATTLE SCHEDULE</h2>
          
          <div className="matches-container">
            {tournamentData.stage === 'group' && (
              <div className="match-round">
                <h3 className="round-title">🔥 Group Stage Battles</h3>
                <div className="matches-grid">
                  {tournamentData.matches
                    .sort((a, b) => {
                      // Convert time strings to comparable format (e.g., "2:00 PM" -> 1400)
                      const timeToMinutes = (timeStr) => {
                        const [time, period] = timeStr.split(' ');
                        const [hours, minutes] = time.split(':').map(Number);
                        const hour24 = period === 'PM' && hours !== 12 ? hours + 12 : 
                                     period === 'AM' && hours === 12 ? 0 : hours;
                        return hour24 * 60 + minutes;
                      };
                      return timeToMinutes(a.time) - timeToMinutes(b.time);
                    })
                    .map(match => (
                    <div key={match.id} className={`match-card ${match.status}`}>
                      <div className="match-header">
                        <div className="match-time">{match.time} • Group {match.group}</div>
                        {match.referee && <div className="match-referee">Ref: {match.referee}</div>}
                      </div>
                      <div className="match-fighters">
                        <div className="match-fighter">
                          {tournamentData.fighters[match.home]?.icon} {tournamentData.fighters[match.home]?.name.split(' ')[0]}
                        </div>
                        <div className="match-vs">VS</div>
                        <div className="match-fighter">
                          {tournamentData.fighters[match.away]?.icon} {tournamentData.fighters[match.away]?.name.split(' ')[0]}
                        </div>
                      </div>
                      <div className="match-score">
                        {match.status === 'completed' 
                          ? `${match.homeScore} - ${match.awayScore}`
                          : match.status === 'live' 
                            ? '🔴 LIVE' 
                            : 'Pending'
                        }
                      </div>
                      {match.status === 'completed' && (
                        <div className="match-stats">
                          {(match.homeYellowCards > 0 || match.awayYellowCards > 0 || 
                            match.homeRedCards > 0 || match.awayRedCards > 0) && (
                            <div className="stat-line cards">
                              <span>Cards: 🟨{match.homeYellowCards || 0} 🟥{match.homeRedCards || 0} - 🟨{match.awayYellowCards || 0} 🟥{match.awayRedCards || 0}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tournamentData.stage === 'playoffs' && tournamentData.playoffs.length > 0 && (
              <div className="match-round">
                <h3 className="round-title">🏆 Playoff Battles</h3>
                <div className="matches-grid">
                  {tournamentData.playoffs
                    .sort((a, b) => {
                      // Convert time strings to comparable format (e.g., "5:00 PM" -> 1700)
                      const timeToMinutes = (timeStr) => {
                        const [time, period] = timeStr.split(' ');
                        const [hours, minutes] = time.split(':').map(Number);
                        const hour24 = period === 'PM' && hours !== 12 ? hours + 12 : 
                                     period === 'AM' && hours === 12 ? 0 : hours;
                        return hour24 * 60 + minutes;
                      };
                      return timeToMinutes(a.time) - timeToMinutes(b.time);
                    })
                    .map(match => (
                    <div key={match.id} className={`match-card ${match.status} ${match.bracket || 'playoff'}`}>
                      <div className="match-header">
                        <div className="match-time">{match.time} • {match.stage}</div>
                        {match.bracket && <div className="bracket-indicator">{match.bracket.toUpperCase()} BRACKET</div>}
                        {match.referee && <div className="match-referee">Ref: {match.referee}</div>}
                      </div>
                      <div className="match-fighters">
                        <div className="match-fighter">
                          {tournamentData.fighters[match.home]?.icon} {tournamentData.fighters[match.home]?.name.split(' ')[0]}
                        </div>
                        <div className="match-vs">VS</div>
                        <div className="match-fighter">
                          {tournamentData.fighters[match.away]?.icon} {tournamentData.fighters[match.away]?.name.split(' ')[0]}
                        </div>
                      </div>
                      <div className="match-score">
                        {match.status === 'completed' 
                          ? `${match.homeScore} - ${match.awayScore}`
                          : match.status === 'live' 
                            ? '🔴 LIVE' 
                            : 'Pending'
                        }
                      </div>
                      {match.status === 'completed' && (
                        <div className="match-stats">
                          {(match.homeYellowCards > 0 || match.awayYellowCards > 0 || 
                            match.homeRedCards > 0 || match.awayRedCards > 0) && (
                            <div className="stat-line cards">
                              <span>Cards: 🟨{match.homeYellowCards || 0} 🟥{match.homeRedCards || 0} - 🟨{match.awayYellowCards || 0} 🟥{match.awayRedCards || 0}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>


        {/* Champions */}
        <section className="champion-section">
          <h2 className="section-title">👑 HALL OF FAME</h2>
          
          <div className="champions-container">
            <div className="champion-card main-champion">
              <div className="champion-rank">🏆</div>
              <div className="champion-title">Season 1 Champion</div>
              <div className="champion-name">{tournamentData.champions.champion || 'TBD'}</div>
            </div>
            
            <div className="champion-card runner-up">
              <div className="champion-rank">🥈</div>
              <div className="champion-title">Runner-up</div>
              <div className="champion-name">{tournamentData.champions.runnerup || 'TBD'}</div>
            </div>
            
            <div className="champion-card third-place">
              <div className="champion-rank">🥉</div>
              <div className="champion-title">3rd Place</div>
              <div className="champion-name">{tournamentData.champions.thirdplace || 'TBD'}</div>
            </div>
          </div>
        </section>

        {/* Tournament Bracket Diagram */}
        <section className="bracket-section">
          <h2 className="section-title">🏆 TOURNAMENT BRACKET</h2>
          
          <div className="bracket-container">
            {/* Group Stage to Playoffs Flow */}
            <div className="bracket-flow">
              <div className="groups-to-playoffs">
                {/* Group Results */}
                <div className="group-results">
                  <div className="group-result-card">
                    <h4>Group A</h4>
                    <div className="qualifier">
                      <span className="position">1st</span>
                      <span className="team">
                        {(() => {
                          const groupA = getSortedFighters('A');
                          const hasMatches = groupA.some(f => f.played > 0);
                          return hasMatches ? (groupA[0]?.name.split(' ')[0] || 'TBD') : 'TBD';
                        })()}
                      </span>
                    </div>
                    <div className="qualifier">
                      <span className="position">2nd</span>
                      <span className="team">
                        {(() => {
                          const groupA = getSortedFighters('A');
                          const hasMatches = groupA.some(f => f.played > 0);
                          return hasMatches ? (groupA[1]?.name.split(' ')[0] || 'TBD') : 'TBD';
                        })()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="group-result-card">
                    <h4>Group B</h4>
                    <div className="qualifier">
                      <span className="position">1st</span>
                      <span className="team">
                        {(() => {
                          const groupB = getSortedFighters('B');
                          const hasMatches = groupB.some(f => f.played > 0);
                          return hasMatches ? (groupB[0]?.name.split(' ')[0] || 'TBD') : 'TBD';
                        })()}
                      </span>
                    </div>
                    <div className="qualifier">
                      <span className="position">2nd</span>
                      <span className="team">
                        {(() => {
                          const groupB = getSortedFighters('B');
                          const hasMatches = groupB.some(f => f.played > 0);
                          return hasMatches ? (groupB[1]?.name.split(' ')[0] || 'TBD') : 'TBD';
                        })()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Arrow to Playoffs */}
                <div className="flow-arrow">
                  <div className="arrow-text">Advance to</div>
                  <div className="arrow">→</div>
                  <div className="arrow-text">Double Elimination</div>
                </div>
              </div>

                {/* Double Elimination Bracket */}
              <div className="double-elimination-bracket">
                {tournamentData.stage === 'group' && (
                  /* Static bracket preview during group stage */
                  <>
                    {/* Upper Bracket Preview */}
                    <div className="upper-bracket">
                      <h3 className="bracket-title">🔥 Upper Bracket Preview</h3>
                      <div className="bracket-rounds">
                        <div className="bracket-round">
                          <div className="round-label">Upper Semis</div>
                          <div className="matches">
                            <div className="bracket-match">
                              <div className="match-participants">
                                <div className="participant">A1</div>
                                <div className="vs">vs</div>
                                <div className="participant">B2</div>
                              </div>
                              <div className="match-time">5:00 PM</div>
                            </div>
                            <div className="bracket-match">
                              <div className="match-participants">
                                <div className="participant">B1</div>
                                <div className="vs">vs</div>
                                <div className="participant">A2</div>
                              </div>
                              <div className="match-time">5:15 PM</div>
                            </div>
                          </div>
                        </div>
                        <div className="bracket-connector">
                          <div className="connector-line"></div>
                          <div className="connector-line"></div>
                        </div>
                        <div className="bracket-round">
                          <div className="round-label">Upper Final</div>
                          <div className="matches">
                            <div className="bracket-match final-match">
                              <div className="match-participants">
                                <div className="participant">Winner US1</div>
                                <div className="vs">vs</div>
                                <div className="participant">Winner US2</div>
                              </div>
                              <div className="match-time">5:45 PM</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Lower Bracket Preview */}
                    <div className="lower-bracket">
                      <h3 className="bracket-title">⚡ Lower Bracket Preview</h3>
                      <div className="bracket-rounds">
                        <div className="bracket-round">
                          <div className="round-label">Lower Semi</div>
                          <div className="matches">
                            <div className="bracket-match">
                              <div className="match-participants">
                                <div className="participant">Loser US1</div>
                                <div className="vs">vs</div>
                                <div className="participant">Loser US2</div>
                              </div>
                              <div className="match-time">5:30 PM</div>
                            </div>
                          </div>
                        </div>
                        <div className="bracket-round">
                          <div className="round-label">Lower Final</div>
                          <div className="matches">
                            <div className="bracket-match">
                              <div className="match-participants">
                                <div className="participant">Winner LS</div>
                                <div className="vs">vs</div>
                                <div className="participant">Loser UF</div>
                              </div>
                              <div className="match-time">6:00 PM</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Grand Final Preview */}
                    <div className="grand-final">
                      <h3 className="bracket-title">👑 Grand Final Preview</h3>
                      <div className="final-match-container">
                        <div className="bracket-match championship">
                          <div className="match-participants">
                            <div className="participant champion-side">Upper Winner</div>
                            <div className="vs championship-vs">VS</div>
                            <div className="participant champion-side">Lower Winner</div>
                          </div>
                          <div className="match-time championship-time">6:15 PM</div>
                          <div className="championship-label">🏆 CHAMPIONSHIP MATCH</div>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {tournamentData.stage === 'playoffs' && (
                  /* Live bracket during playoffs */
                  <>
                    {/* Live Upper Bracket */}
                    <div className="upper-bracket">
                      <h3 className="bracket-title">🔥 Upper Bracket - LIVE</h3>
                      <div className="bracket-rounds">
                        <div className="bracket-round">
                          <div className="round-label">Upper Semis</div>
                          <div className="matches">
                            {tournamentData.doubleElimination?.upperBracket
                              ?.filter(match => match.stage.includes('Semi'))
                              ?.map(match => (
                                <div key={match.id} className={`bracket-match ${match.status}`}>
                                  <div className="match-participants">
                                    <div className="participant">
                                      {tournamentData.fighters[match.home]?.name.split(' ')[0] || 'TBD'}
                                    </div>
                                    <div className="vs">vs</div>
                                    <div className="participant">
                                      {tournamentData.fighters[match.away]?.name.split(' ')[0] || 'TBD'}
                                    </div>
                                  </div>
                                  <div className="match-time">{match.time}</div>
                                  {match.status === 'completed' && (
                                    <div className="match-result">
                                      {match.homeScore}-{match.awayScore}
                                    </div>
                                  )}
                                </div>
                              ))}
                          </div>
                        </div>
                        <div className="bracket-connector">
                          <div className="connector-line"></div>
                          <div className="connector-line"></div>
                        </div>
                        <div className="bracket-round">
                          <div className="round-label">Upper Final</div>
                          <div className="matches">
                            {tournamentData.doubleElimination?.upperBracket
                              ?.filter(match => match.stage.includes('Final'))
                              ?.map(match => (
                                <div key={match.id} className={`bracket-match final-match ${match.status}`}>
                                  <div className="match-participants">
                                    <div className="participant">
                                      {tournamentData.fighters[match.home]?.name.split(' ')[0] || 'TBD'}
                                    </div>
                                    <div className="vs">vs</div>
                                    <div className="participant">
                                      {tournamentData.fighters[match.away]?.name.split(' ')[0] || 'TBD'}
                                    </div>
                                  </div>
                                  <div className="match-time">{match.time}</div>
                                  {match.status === 'completed' && (
                                    <div className="match-result">
                                      {match.homeScore}-{match.awayScore}
                                    </div>
                                  )}
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Live Lower Bracket */}
                    <div className="lower-bracket">
                      <h3 className="bracket-title">⚡ Lower Bracket - LIVE</h3>
                      <div className="bracket-rounds">
                        <div className="bracket-round">
                          <div className="round-label">Lower Matches</div>
                          <div className="matches">
                            {tournamentData.doubleElimination?.lowerBracket?.map(match => (
                              <div key={match.id} className={`bracket-match ${match.status}`}>
                                <div className="match-participants">
                                  <div className="participant">
                                    {tournamentData.fighters[match.home]?.name.split(' ')[0] || 'TBD'}
                                  </div>
                                  <div className="vs">vs</div>
                                  <div className="participant">
                                    {tournamentData.fighters[match.away]?.name.split(' ')[0] || 'TBD'}
                                  </div>
                                </div>
                                <div className="match-time">{match.time}</div>
                                <div className="match-stage">{match.stage}</div>
                                {match.status === 'completed' && (
                                  <div className="match-result">
                                    {match.homeScore}-{match.awayScore}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Live Grand Final */}
                    {tournamentData.doubleElimination?.grandFinal && (
                      <div className="grand-final">
                        <h3 className="bracket-title">👑 Grand Final - LIVE</h3>
                        <div className="final-match-container">
                          <div className={`bracket-match championship ${tournamentData.doubleElimination.grandFinal.status}`}>
                            <div className="match-participants">
                              <div className="participant champion-side">
                                {tournamentData.fighters[tournamentData.doubleElimination.grandFinal.home]?.name.split(' ')[0] || 'Upper Winner'}
                              </div>
                              <div className="vs championship-vs">VS</div>
                              <div className="participant champion-side">
                                {tournamentData.fighters[tournamentData.doubleElimination.grandFinal.away]?.name.split(' ')[0] || 'Lower Winner'}
                              </div>
                            </div>
                            <div className="match-time championship-time">{tournamentData.doubleElimination.grandFinal.time}</div>
                            {tournamentData.doubleElimination.grandFinal.status === 'completed' && (
                              <div className="championship-result">
                                {tournamentData.doubleElimination.grandFinal.homeScore}-{tournamentData.doubleElimination.grandFinal.awayScore}
                              </div>
                            )}
                            <div className="championship-label">🏆 CHAMPIONSHIP MATCH</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Bracket Legend */}
            <div className="bracket-legend">
              <h4>📖 Bracket Guide</h4>
              <div className="legend-items">
                <div className="legend-item">
                  <span className="legend-color upper"></span>
                  <span>Upper Bracket - Winners stay in winners bracket</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color lower"></span>
                  <span>Lower Bracket - Second chance for eliminated players</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color final"></span>
                  <span>Grand Final - Championship match (Best of 1)</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tournament Rules */}
        <section className="rules-section">
          <h2 className="section-title">📋 TOURNAMENT RULES & FORMAT</h2>
          
          <div className="rules-container">
            {/* Format Overview */}
            <div className="rules-card">
              <h3 className="rules-title">🏆 Tournament Format</h3>
              <div className="rules-content">
                <p><strong>Structure:</strong> Group Stage + Double Elimination Playoffs</p>
                <p><strong>Participants:</strong> 8 Players in 2 Groups (4 players each)</p>
                <p><strong>Qualification:</strong> Top 2 from each group advance to playoffs</p>
                <p><strong>Total Matches:</strong> 12 Group Stage + Up to 5 Playoff matches</p>
              </div>
            </div>

            {/* Group Stage Rules */}
            <div className="rules-card">
              <h3 className="rules-title">⚔️ Group Stage Rules</h3>
              <div className="rules-content">
                <p><strong>Format:</strong> Round-robin (everyone plays everyone in their group)</p>
                <p><strong>Match Length:</strong> 5-minute halves (10 minutes total)</p>
                <p><strong>Points System:</strong></p>
                <ul>
                  <li>🏆 Win = 3 points</li>
                  <li>🤝 Draw = 1 point</li>
                  <li>❌ Loss = 0 points</li>
                </ul>
                <p><strong>Matches per Group:</strong> 6 matches (3 matches per player)</p>
              </div>
            </div>

            {/* FIFA Tiebreakers */}
            <div className="rules-card">
              <h3 className="rules-title">⚖️ FIFA Tiebreaker Rules</h3>
              <div className="rules-content">
                <p><strong>If teams are tied on points, ranking determined by:</strong></p>
                <ol>
                  <li>🎯 <strong>Points</strong> in all group matches</li>
                  <li>📊 <strong>Goal Difference</strong> in all group matches</li>
                  <li>⚽ <strong>Goals For</strong> in all group matches</li>
                  <li>🤝 <strong>Head-to-Head Points</strong> between tied teams</li>
                  <li>📈 <strong>Head-to-Head Goal Difference</strong> between tied teams</li>
                  <li>🎯 <strong>Head-to-Head Goals For</strong> between tied teams</li>
                  <li>🟨🟥 <strong>Fair Play Points</strong> (Yellow = 1pt, Red = 4pts - LOWER is better)</li>
                  <li>🎲 <strong>Drawing of Lots</strong> (random selection)</li>
                </ol>
              </div>
            </div>

            {/* Double Elimination */}
            <div className="rules-card">
              <h3 className="rules-title">🏅 Double Elimination Playoffs</h3>
              <div className="rules-content">
                <p><strong>Bracket Structure:</strong></p>
                <ul>
                  <li>🔥 <strong>Upper Bracket:</strong> Winners stay in winners bracket</li>
                  <li>⚡ <strong>Lower Bracket:</strong> Losers get second chance</li>
                  <li>👑 <strong>Grand Final:</strong> Upper bracket winner vs Lower bracket champion</li>
                </ul>
                <p><strong>Seeding:</strong></p>
                <ul>
                  <li>Upper Semi 1: Group A Winner vs Group B Runner-up</li>
                  <li>Upper Semi 2: Group B Winner vs Group A Runner-up</li>
                </ul>
                <p><strong>Format:</strong> All matches are Best of 1 (BO1)</p>
              </div>
            </div>

            {/* Match Rules */}
            <div className="rules-card">
              <h3 className="rules-title">🎮 Match Rules</h3>
              <div className="rules-content">
                <p><strong>Game:</strong> FC 25 (FIFA 25)</p>
                <p><strong>Match Length:</strong> 5-minute halves</p>
                <p><strong>Draws:</strong> Allowed in Group Stage, Extra Time in Playoffs</p>
                <p><strong>Cards Tracked:</strong> Yellow Cards (🟨) and Red Cards (🟥) only</p>
                <p><strong>Fair Play:</strong> Disciplinary points affect tiebreaking</p>
                <p><strong>Venue:</strong> Main Arena</p>
              </div>
            </div>

            {/* Schedule */}
            <div className="rules-card">
              <h3 className="rules-title">⏰ Tournament Schedule</h3>
              <div className="rules-content">
                <p><strong>Group Stage:</strong> 2:00 PM - 4:45 PM</p>
                <p><strong>Playoff Break:</strong> 4:45 PM - 5:00 PM (15 minutes)</p>
                <p><strong>Double Elimination:</strong> 5:00 PM - 6:15 PM</p>
                <p><strong>Total Duration:</strong> ~4 hours 15 minutes</p>
                <p><strong>Match Intervals:</strong> 15 minutes between matches</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
