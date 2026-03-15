import Anthropic from '@anthropic-ai/sdk';
import { getCached, setCache, SIX_HOURS, FIVE_MINUTES, ONE_MINUTE } from './cache';
import { mockTeams } from '@/lib/data/mock/teams';
import type { Team, Player, Game, Article } from '@/lib/types';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Helper: ask Claude with web search and get structured JSON back
async function askClaudeWithSearch<T>(prompt: string, cacheKey: string, ttl: number): Promise<T | null> {
  // Check cache first
  const cached = getCached<T>(cacheKey);
  if (cached) return cached;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 16000,
      tools: [
        {
          type: 'web_search_20250305' as const,
          name: 'web_search',
          max_uses: 5,
        } as unknown as Anthropic.Messages.Tool,
      ],
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    // Extract the text content from the response
    let textContent = '';
    for (const block of response.content) {
      if (block.type === 'text') {
        textContent += block.text;
      }
    }

    // Parse JSON from response - look for JSON between ```json and ``` or just parse directly
    let jsonStr = textContent;
    const jsonMatch = textContent.match(/```json\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1].trim();
    } else {
      // Try to find JSON array or object
      const arrMatch = textContent.match(/\[[\s\S]*\]/);
      const objMatch = textContent.match(/\{[\s\S]*\}/);
      if (arrMatch) jsonStr = arrMatch[0];
      else if (objMatch) jsonStr = objMatch[0];
    }

    const data = JSON.parse(jsonStr) as T;
    setCache(cacheKey, data, ttl);
    return data;
  } catch (error) {
    console.error(`[web-data] Error fetching ${cacheKey}:`, error);
    return null;
  }
}

// ============================================================
// NBA TEAMS - merge real standings into mock team data
// ============================================================
export async function fetchNBATeams(): Promise<Team[]> {
  const baseMockTeams = mockTeams.filter(t => t.league === 'NBA');

  const prompt = `Search the web for the current 2024-25 NBA standings. Return ONLY a JSON object mapping team abbreviations to their current win-loss record. Include ALL 30 teams.

Return ONLY JSON (no other text):
\`\`\`json
{"BOS":{"w":52,"l":18},"CLE":{"w":50,"l":20},"NYK":{"w":46,"l":24},"OKC":{"w":55,"l":15},"DEN":{"w":48,"l":22},"MIL":{"w":46,"l":24},"LAL":{"w":42,"l":28},"DAL":{"w":44,"l":26},"MIN":{"w":46,"l":24},"PHX":{"w":41,"l":29},"GSW":{"w":38,"l":32},"MIA":{"w":40,"l":30},"PHI":{"w":35,"l":35},"IND":{"w":40,"l":30},"SAC":{"w":38,"l":32},"HOU":{"w":38,"l":32},"MEM":{"w":36,"l":34},"NOP":{"w":32,"l":38},"SAS":{"w":30,"l":40},"ATL":{"w":34,"l":36},"CHI":{"w":30,"l":40},"ORL":{"w":36,"l":34},"BKN":{"w":22,"l":48},"TOR":{"w":24,"l":46},"POR":{"w":22,"l":48},"DET":{"w":26,"l":44},"CHA":{"w":20,"l":50},"WAS":{"w":18,"l":52},"LAC":{"w":36,"l":34},"UTA":{"w":28,"l":42}}
\`\`\`

Use real current records. The example above is just a format guide — replace with actual current data.`;

  type StandingsMap = Record<string, { w: number; l: number }>;
  const standings = await askClaudeWithSearch<StandingsMap>(prompt, 'nba-teams', SIX_HOURS);

  if (standings) {
    return baseMockTeams.map(team => {
      const record = standings[team.abbreviation];
      if (record) {
        return { ...team, wins: record.w, losses: record.l, record: `${record.w}-${record.l}` };
      }
      return team;
    }).sort((a, b) => b.wins - a.wins);
  }

  return baseMockTeams;
}

// ============================================================
// NFL TEAMS - merge real standings into mock team data
// ============================================================
export async function fetchNFLTeams(): Promise<Team[]> {
  const baseMockTeams = mockTeams.filter(t => t.league === 'NFL');

  const prompt = `Search the web for the 2024-25 NFL final regular season standings. Return ONLY a JSON object mapping team abbreviations to their win-loss record. Include ALL 32 teams.

Return ONLY JSON (no other text):
\`\`\`json
{"PHI":{"w":14,"l":3},"DET":{"w":15,"l":2},"KC":{"w":15,"l":2},"BUF":{"w":13,"l":4},"BAL":{"w":12,"l":5},"MIN":{"w":14,"l":3},"GB":{"w":11,"l":6},"WAS":{"w":12,"l":5},"LAR":{"w":10,"l":7},"TB":{"w":10,"l":7},"DEN":{"w":10,"l":7},"PIT":{"w":10,"l":7},"LAC":{"w":11,"l":6},"HOU":{"w":10,"l":7},"SF":{"w":6,"l":11},"DAL":{"w":7,"l":10},"MIA":{"w":8,"l":9},"CIN":{"w":9,"l":8},"SEA":{"w":10,"l":7},"ATL":{"w":8,"l":9},"ARI":{"w":8,"l":9},"CHI":{"w":5,"l":12},"NO":{"w":5,"l":12},"NYJ":{"w":5,"l":12},"NYG":{"w":3,"l":14},"JAX":{"w":4,"l":13},"TEN":{"w":3,"l":14},"NE":{"w":4,"l":13},"IND":{"w":8,"l":9},"CAR":{"w":5,"l":12},"CLE":{"w":3,"l":14},"LV":{"w":4,"l":13}}
\`\`\`

Use real records from the 2024-25 NFL season. The example above is a format guide — replace with actual data.`;

  type StandingsMap = Record<string, { w: number; l: number }>;
  const standings = await askClaudeWithSearch<StandingsMap>(prompt, 'nfl-teams', SIX_HOURS);

  if (standings) {
    return baseMockTeams.map(team => {
      const record = standings[team.abbreviation];
      if (record) {
        return { ...team, wins: record.w, losses: record.l, record: `${record.w}-${record.l}` };
      }
      return team;
    }).sort((a, b) => b.wins - a.wins);
  }

  return baseMockTeams;
}

// ============================================================
// NBA PLAYERS - real current season stats
// ============================================================
export async function fetchNBAPlayers(): Promise<Player[]> {
  const prompt = `Search the web for the current 2024-25 NBA season's top players and their stats. I need the top 20-25 NBA players by impact/recognition.

MUST include these players: Jayson Tatum, Jaylen Brown, LeBron James, Luka Doncic, Nikola Jokic, Shai Gilgeous-Alexander, Giannis Antetokounmpo, Stephen Curry, Anthony Edwards, Kevin Durant, Jalen Brunson, Donovan Mitchell, Kyrie Irving, Anthony Davis, Devin Booker, Jaylen Williams (OKC), Tyrese Haliburton, Bam Adebayo, Karl-Anthony Towns, Victor Wembanyama.

Return ONLY a JSON array. Each player:
\`\`\`json
[
  {
    "id": "jayson-tatum",
    "name": "Jayson Tatum",
    "slug": "jayson-tatum",
    "firstName": "Jayson",
    "lastName": "Tatum",
    "number": "0",
    "position": "SF",
    "height": "6-8",
    "weight": "210",
    "age": 27,
    "teamId": "bos",
    "league": "NBA",
    "featured": true,
    "trending": true,
    "bio": "Two-way superstar leading the Celtics.",
    "seasonStats": {
      "ppg": 27.1,
      "rpg": 8.8,
      "apg": 4.9,
      "spg": 1.1,
      "bpg": 0.6,
      "fgPct": 47.1,
      "threePct": 37.6,
      "ftPct": 85.2,
      "gamesPlayed": 68,
      "minutesPerGame": 36.2
    }
  }
]
\`\`\`

Use the SAME team IDs as: bos, lal, dal, den, mil, okc, gsw, phi (76ers), mia, phx, min, nyk, cle, sas, ind, lac, etc.
Set featured=true for Celtics players + top 5 stars. Set trending=true for players having breakout/hot stretches.
Use REAL current stats from the 2024-25 season. Bio should be 1 sentence.`;

  return (await askClaudeWithSearch<Player[]>(prompt, 'nba-players', SIX_HOURS)) || [];
}

// ============================================================
// NFL PLAYERS - real current/recent season stats
// ============================================================
export async function fetchNFLPlayers(): Promise<Player[]> {
  const prompt = `Search the web for the current/most recent NFL season's top players and their stats. I need the top 15-20 NFL players.

MUST include: Jalen Hurts, A.J. Brown, DeVonta Smith, Saquon Barkley, Dallas Goedert, Patrick Mahomes, Josh Allen, Lamar Jackson, Tyreek Hill, CeeDee Lamb, Ja'Marr Chase, Derrick Henry, Amon-Ra St. Brown, Travis Kelce, Micah Parsons.

Return ONLY a JSON array. Each player:
\`\`\`json
[
  {
    "id": "jalen-hurts",
    "name": "Jalen Hurts",
    "slug": "jalen-hurts",
    "firstName": "Jalen",
    "lastName": "Hurts",
    "number": "1",
    "position": "QB",
    "age": 26,
    "teamId": "phi-eagles",
    "league": "NFL",
    "featured": true,
    "trending": true,
    "bio": "Dual-threat quarterback leading the Eagles.",
    "seasonStats": {
      "passingYards": 3858,
      "passingTDs": 23,
      "completionPct": 67.2,
      "rushingYards": 605,
      "rushingTDs": 15,
      "gamesPlayed": 17
    }
  }
]
\`\`\`

Use slug-based team IDs matching NFL teams (phi-eagles, kc-chiefs, buf-bills, bal-ravens, etc.).
Set featured=true for Eagles players + top stars. Stats should match position (QBs get passing stats, RBs rushing, WRs receiving, etc.).
Use REAL stats from the most recent completed NFL season.`;

  return (await askClaudeWithSearch<Player[]>(prompt, 'nfl-players', SIX_HOURS)) || [];
}

// ============================================================
// LIVE/TODAY'S NBA GAMES
// ============================================================
export async function fetchTodaysNBAGames(): Promise<Game[]> {
  const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  const prompt = `Search the web for today's NBA games (${today}). Find any games being played today, including:
- Games currently in progress (status: "LIVE" with current scores and quarter)
- Games completed today (status: "FINAL" with final scores)
- Games scheduled for later today (status: "SCHEDULED")

Also check yesterday's completed games for recent results.

If there are NO NBA games today, check for the most recent games from the last 2-3 days and upcoming games in the next 2-3 days.

Return ONLY a JSON array:
\`\`\`json
[
  {
    "id": "nba-20250315-bos-lal",
    "league": "NBA",
    "season": "2024-25",
    "homeTeam": { "id": "bos", "name": "Boston Celtics", "slug": "boston-celtics", "abbreviation": "BOS", "city": "Boston", "league": "NBA", "conference": "Eastern", "division": "Atlantic", "primaryColor": "#007A33", "secondaryColor": "#BA9653", "wins": 52, "losses": 18, "record": "52-18", "featured": true },
    "awayTeam": { "id": "lal", "name": "Los Angeles Lakers", "slug": "los-angeles-lakers", "abbreviation": "LAL", "city": "Los Angeles", "league": "NBA", "conference": "Western", "division": "Pacific", "primaryColor": "#552583", "secondaryColor": "#FDB927", "wins": 42, "losses": 28, "record": "42-28", "featured": false },
    "homeScore": 87,
    "awayScore": 81,
    "status": "LIVE",
    "quarter": 3,
    "timeRemaining": "4:22",
    "possession": "home",
    "startTime": "2025-03-15T19:30:00Z",
    "venue": "TD Garden",
    "broadcast": "ESPN",
    "featured": true
  }
]
\`\`\`

For SCHEDULED games, set scores to 0. For LIVE games, include quarter and timeRemaining. For FINAL games, include final scores.
IMPORTANT: Use real team data with correct abbreviations, records, and colors. Flag any Celtics games as featured=true.
Return at least 3-8 games total combining today's, recent, and upcoming.`;

  return (await askClaudeWithSearch<Game[]>(prompt, 'nba-games-today', FIVE_MINUTES)) || [];
}

// ============================================================
// LIVE/TODAY'S NFL GAMES
// ============================================================
export async function fetchTodaysNFLGames(): Promise<Game[]> {
  const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  const prompt = `Search the web for today's NFL games (${today}) and recent/upcoming NFL games.

If it's NFL season (September-February), find today's games. If it's the offseason, find the most recent completed games and any upcoming preseason/scheduled games.

Return ONLY a JSON array with the same structure as NBA games but with NFL teams. Use status LIVE/FINAL/SCHEDULED appropriately. For NFL, use "quarter" for the current quarter.

Flag Eagles games as featured=true. Use team IDs like "phi-eagles", "kc-chiefs", etc.

Return 3-6 games. If no NFL games are active or recent, return the last few results from the most recent NFL week and any upcoming scheduled games.

\`\`\`json
[
  {
    "id": "nfl-20250315-phi-dal",
    "league": "NFL",
    "season": "2024-25",
    "homeTeam": { "id": "phi-eagles", "name": "Philadelphia Eagles", "slug": "philadelphia-eagles", "abbreviation": "PHI", "city": "Philadelphia", "league": "NFL", "conference": "NFC", "division": "NFC East", "primaryColor": "#004C54", "secondaryColor": "#A5ACAF", "wins": 14, "losses": 3, "record": "14-3", "featured": true },
    "awayTeam": { "id": "dal-cowboys", "name": "Dallas Cowboys", "slug": "dallas-cowboys", "abbreviation": "DAL", "city": "Dallas", "league": "NFL", "conference": "NFC", "division": "NFC East", "primaryColor": "#003594", "secondaryColor": "#869397", "wins": 7, "losses": 10, "record": "7-10", "featured": false },
    "homeScore": 21,
    "awayScore": 14,
    "status": "FINAL",
    "startTime": "2025-03-15T13:00:00Z",
    "venue": "Lincoln Financial Field",
    "broadcast": "FOX",
    "featured": true
  }
]
\`\`\``;

  return (await askClaudeWithSearch<Game[]>(prompt, 'nfl-games-today', FIVE_MINUTES)) || [];
}

// ============================================================
// CELTICS-SPECIFIC LIVE CHECK (frequent polling)
// ============================================================
export async function fetchCelticsLiveGame(): Promise<Game | null> {
  const prompt = `Search the web: Are the Boston Celtics playing a game RIGHT NOW? Check current NBA scores.

If the Celtics are currently playing, return the game data as JSON:
\`\`\`json
{
  "id": "nba-celtics-live",
  "league": "NBA",
  "season": "2024-25",
  "homeTeam": { "id": "bos", "name": "Boston Celtics", "slug": "boston-celtics", "abbreviation": "BOS", "city": "Boston", "league": "NBA", "conference": "Eastern", "division": "Atlantic", "primaryColor": "#007A33", "secondaryColor": "#BA9653", "wins": 52, "losses": 18, "record": "52-18", "featured": true },
  "awayTeam": { "id": "opponent", "name": "Opponent", "slug": "opponent", "abbreviation": "OPP", "city": "City", "league": "NBA", "conference": "...", "division": "...", "primaryColor": "...", "secondaryColor": "...", "wins": 0, "losses": 0, "record": "0-0", "featured": false },
  "homeScore": 87,
  "awayScore": 81,
  "status": "LIVE",
  "quarter": 3,
  "timeRemaining": "4:22",
  "possession": "home",
  "startTime": "...",
  "venue": "...",
  "broadcast": "...",
  "featured": true
}
\`\`\`

If the Celtics are NOT currently playing, return exactly: null`;

  return await askClaudeWithSearch<Game | null>(prompt, 'celtics-live', ONE_MINUTE);
}

// ============================================================
// EAGLES-SPECIFIC LIVE CHECK (frequent polling)
// ============================================================
export async function fetchEaglesLiveGame(): Promise<Game | null> {
  const prompt = `Search the web: Are the Philadelphia Eagles playing a game RIGHT NOW? Check current NFL scores.

If the Eagles are currently playing, return the game data as JSON with the same structure as above but with NFL teams. If NOT playing, return exactly: null`;

  return await askClaudeWithSearch<Game | null>(prompt, 'eagles-live', ONE_MINUTE);
}

// ============================================================
// RECENT NEWS/ARTICLES
// ============================================================
export async function fetchLatestSportsNews(): Promise<Article[]> {
  const prompt = `Search the web for the latest NBA and NFL news from the past few days. Find 5-6 interesting stories, especially about the Boston Celtics, Philadelphia Eagles, and major league storylines.

Return ONLY a JSON array:
\`\`\`json
[
  {
    "id": "article-1",
    "title": "Celtics Continue Historic Win Streak",
    "slug": "celtics-continue-historic-win-streak",
    "excerpt": "Boston's dominant run shows no signs of slowing down...",
    "content": "Write a 3-4 paragraph article summary here with real details from the news...",
    "authorName": "Ball Intelligence Staff",
    "category": "NBA",
    "tags": ["NBA", "Celtics"],
    "readingTime": 3,
    "featured": true,
    "published": true,
    "publishedAt": "2025-03-15T12:00:00Z"
  }
]
\`\`\`

Write the content as real sports journalism based on what you find. Make it engaging and informative. Include Celtics and Eagles stories if any are available. Use real facts from the search results.`;

  return (await askClaudeWithSearch<Article[]>(prompt, 'sports-news', SIX_HOURS)) || [];
}

// ============================================================
// REFRESH ALL DATA
// ============================================================
export async function refreshAllData(): Promise<{ success: boolean; refreshed: string[] }> {
  const refreshed: string[] = [];

  try {
    await fetchNBATeams();
    refreshed.push('nba-teams');
  } catch (e) { console.error('Failed to refresh NBA teams:', e); }

  try {
    await fetchNFLTeams();
    refreshed.push('nfl-teams');
  } catch (e) { console.error('Failed to refresh NFL teams:', e); }

  try {
    await fetchNBAPlayers();
    refreshed.push('nba-players');
  } catch (e) { console.error('Failed to refresh NBA players:', e); }

  try {
    await fetchNFLPlayers();
    refreshed.push('nfl-players');
  } catch (e) { console.error('Failed to refresh NFL players:', e); }

  try {
    await fetchTodaysNBAGames();
    refreshed.push('nba-games');
  } catch (e) { console.error('Failed to refresh NBA games:', e); }

  try {
    await fetchTodaysNFLGames();
    refreshed.push('nfl-games');
  } catch (e) { console.error('Failed to refresh NFL games:', e); }

  try {
    await fetchLatestSportsNews();
    refreshed.push('news');
  } catch (e) { console.error('Failed to refresh news:', e); }

  return { success: true, refreshed };
}
