export const revalidate = 60;

import { HeroSection } from '@/components/home/hero-section';
import { LiveGamesStrip } from '@/components/home/live-games-strip';
import { FeaturedTeams } from '@/components/home/featured-teams';
import { TrendingPlayers } from '@/components/home/trending-players';
import { TopStatsSection } from '@/components/home/top-stats-section';
import { AIRecapsSection } from '@/components/home/ai-recaps-section';
import { ShotIQTeaser } from '@/components/home/shot-iq-teaser';
import { BlogPreview } from '@/components/home/blog-preview';
import { SmartFacts } from '@/components/home/smart-facts';

import { getFeaturedGame, getLiveGames, getRecentGames } from '@/lib/services/games';
import { getFeaturedTeams } from '@/lib/services/teams';
import { getTrendingPlayers } from '@/lib/services/players';
import { getNBALeaders, getNFLLeaders } from '@/lib/services/stats';
import { getFeaturedArticles } from '@/lib/services/blog';

export default async function HomePage() {
  const [featuredGame, liveGames, recentGames, featuredTeams, trendingPlayers, articles] =
    await Promise.all([
      getFeaturedGame(),
      getLiveGames(),
      getRecentGames(),
      getFeaturedTeams(),
      getTrendingPlayers(),
      getFeaturedArticles(),
    ]);

  const [nbaPoints, nbaAssists, nflPassing, nflRushing] = await Promise.all([
    getNBALeaders('ppg', 1),
    getNBALeaders('apg', 1),
    getNFLLeaders('passingYards', 1),
    getNFLLeaders('rushingYards', 1),
  ]);

  // Build recap data from recent games
  const recapSummaries: Record<string, string> = {
    'nba-live-1':
      'Jayson Tatum poured in 34 points and Jaylen Brown added 22 as the Celtics cruised past the Lakers. Boston controlled the game wire-to-wire with dominant defense in the second half.',
    'nfl-live-1':
      'The Eagles obliterated Dallas behind Jalen Hurts\' 3 touchdown passes and Saquon Barkley\'s 142 rushing yards. Philadelphia\'s defense forced 3 turnovers in a statement NFC East win.',
    'nba-live-2':
      'Nikola Jokic put up a triple-double as Denver edged out OKC in a thriller. SGA had 28 points but the Nuggets\' depth proved to be the difference down the stretch.',
    'nba-final-1':
      'Jayson Tatum led the charge with 32 points as Boston dominated the second half. The Celtics defense held New York to just 18 fourth-quarter points.',
    'nba-final-2':
      'Giannis recorded a monster double-double with 35 points and 14 rebounds. Milwaukee controlled the paint all night long.',
    'nfl-final-1':
      'Jalen Hurts threw for 285 yards and 3 touchdowns in a statement win. Saquon Barkley added 127 rushing yards.',
  };

  const recaps = recentGames.slice(0, 3).map((game) => ({
    game,
    summary:
      recapSummaries[game.id] ||
      `${game.homeTeam.abbreviation} ${game.homeScore > game.awayScore ? 'defeated' : 'fell to'} ${game.awayTeam.abbreviation} in a ${Math.abs(game.homeScore - game.awayScore) < 5 ? 'close contest' : 'convincing performance'}.`,
  }));

  const formatLeader = (leaders: { playerName: string; value: number; team: string }[]) =>
    leaders[0]
      ? { name: leaders[0].playerName, value: leaders[0].value, team: leaders[0].team }
      : { name: '-', value: 0, team: '-' };

  return (
    <div className="space-y-0">
      <HeroSection featuredGame={featuredGame} liveGameCount={liveGames.length} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 py-10">
        <LiveGamesStrip games={liveGames} />

        <FeaturedTeams
          teams={featuredTeams.filter((t) =>
            ['boston-celtics', 'philadelphia-eagles'].includes(t.slug)
          )}
        />

        <TrendingPlayers players={trendingPlayers} />

        <TopStatsSection
          nbaPointsLeader={formatLeader(nbaPoints)}
          nbaAssistsLeader={formatLeader(nbaAssists)}
          nflPassingLeader={formatLeader(nflPassing)}
          nflRushingLeader={formatLeader(nflRushing)}
        />

        <AIRecapsSection recaps={recaps} />

        <ShotIQTeaser />

        <BlogPreview articles={articles} />

        <SmartFacts />
      </div>
    </div>
  );
}
