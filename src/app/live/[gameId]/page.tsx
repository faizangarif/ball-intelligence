import { notFound } from 'next/navigation';
import { getLiveGameState } from '@/lib/services/live';
import { getGame } from '@/lib/services/games';
import type { LiveGameState } from '@/lib/types';
import { LiveGameDetail } from '@/components/live/live-game-detail';

interface Props {
  params: Promise<{ gameId: string }>;
}

export default async function LiveGamePage({ params }: Props) {
  const { gameId } = await params;

  let state = await getLiveGameState(gameId);

  if (!state) {
    const game = await getGame(gameId);
    if (!game) notFound();

    const basicState: LiveGameState = {
      game,
      events: game.events ?? [],
      lastUpdate: new Date().toISOString(),
      momentum: game.homeScore > game.awayScore ? 'home' : game.awayScore > game.homeScore ? 'away' : 'neutral',
      keyPlayers: [],
      aiCommentary: [
        `${game.homeTeam.name} vs ${game.awayTeam.name} — follow along for live updates.`,
      ],
      summary: game.status === 'FINAL'
        ? `${game.homeTeam.name} ${game.homeScore > game.awayScore ? 'defeated' : 'fell to'} ${game.awayTeam.name} ${Math.max(game.homeScore, game.awayScore)}-${Math.min(game.homeScore, game.awayScore)}.`
        : `${game.homeTeam.name} hosts ${game.awayTeam.name} at ${game.venue ?? 'TBD'}.`,
    };
    state = basicState;
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LiveGameDetail initialState={state} />
      </div>
    </main>
  );
}
