import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `You are Ball Intelligence's AI sports analyst — a sharp, energetic, and knowledgeable commentator who makes sports fun and accessible. You write like a smart young sports fan who really knows the game. Your tone is:
- Exciting but not over-the-top
- Smart and analytical
- Fun to read
- Clean and concise
- Like talking to a friend who's a sports genius

Never use generic filler. Every sentence should teach something or be entertaining. Keep responses focused and punchy.`;

export async function generateAICommentary(prompt: string): Promise<string> {
  try {
    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 300,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: prompt }],
    });

    const block = message.content[0];
    if (block.type === 'text') return block.text;
    return '';
  } catch (error) {
    console.error('AI commentary error:', error);
    return '';
  }
}

export async function generateGameRecap(
  homeTeam: string,
  awayTeam: string,
  homeScore: number,
  awayScore: number,
  league: string,
  events: string[]
): Promise<string> {
  const prompt = `Write a 2-3 sentence game recap for this ${league} game:

${homeTeam} ${homeScore} — ${awayTeam} ${awayScore} (Final)

Key events:
${events.slice(0, 6).map((e) => `- ${e}`).join('\n')}

Write an exciting, insightful recap that highlights the key storyline. Be specific about what happened. No generic filler.`;

  return generateAICommentary(prompt);
}

export async function generatePlayerAnalysis(
  playerName: string,
  team: string,
  position: string,
  league: string,
  stats: Record<string, number>
): Promise<string> {
  const statLines = Object.entries(stats)
    .filter(([, v]) => typeof v === 'number' && v > 0)
    .slice(0, 8)
    .map(([k, v]) => `${k}: ${v}`)
    .join(', ');

  const prompt = `Write a 3-4 sentence scouting report / analysis of ${playerName} (${position}, ${team}, ${league}).

Current season stats: ${statLines}

What makes this player special? What should fans watch for? Be specific and insightful. Write like a smart young analyst.`;

  return generateAICommentary(prompt);
}

export async function generateTeamAnalysis(
  teamName: string,
  record: string,
  league: string,
  conference: string,
  keyPlayers: string[]
): Promise<string> {
  const prompt = `Write a 3-4 sentence analysis of the ${teamName} (${record}, ${conference}, ${league}).

Key players: ${keyPlayers.join(', ')}

What's their identity this season? What are their strengths? What should fans be excited about? Be specific and insightful.`;

  return generateAICommentary(prompt);
}

export async function generateSmartFact(
  playerOrTeam: string,
  stat: string,
  context: string
): Promise<string> {
  const prompt = `Generate one fascinating, specific sports stat/fact about ${playerOrTeam} related to: ${stat}. Context: ${context}

Write exactly ONE sentence that would make a sports fan say "wow, I didn't know that." Make it specific and surprising. Just the fact, no intro.`;

  return generateAICommentary(prompt);
}

export async function generateShotAnalysis(
  playerName: string,
  zones: { name: string; percentage: number; attempts: number }[]
): Promise<string> {
  const zoneLines = zones
    .map((z) => `${z.name}: ${z.percentage.toFixed(1)}% (${z.attempts} attempts)`)
    .join(', ');

  const prompt = `Analyze this NBA player's shooting chart in 2-3 sentences:

Player: ${playerName}
Shot zones: ${zoneLines}

What stands out? Where are they most dangerous? Any weaknesses? Write like a basketball analytics expert but keep it accessible and fun.`;

  return generateAICommentary(prompt);
}
