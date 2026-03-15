import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPlayer, getPlayersByTeam, getPlayers } from '@/lib/services/players';
import { PlayerHero } from '@/components/players/player-hero';
import { PlayerStatsGrid } from '@/components/players/player-stats-grid';
import { PlayerGameLog } from '@/components/players/player-game-log';
import { RelatedPlayers } from '@/components/players/related-players';
import { AIPlayerAnalysis } from '@/components/players/ai-player-analysis';

interface Props {
  params: Promise<{ slug: string }>;
}

const playerSummaries: Record<string, string> = {
  'jayson-tatum':
    "Jayson Tatum is the engine that drives the Celtics. His ability to score from all three levels makes him virtually unguardable. Whether it's pulling up from deep, attacking the mid-range, or finishing at the rim, Tatum's offensive versatility is elite. Combined with his improving playmaking and solid defense, he's firmly in the MVP conversation.",
  'jaylen-brown':
    "Jaylen Brown is the perfect complement to Jayson Tatum and a superstar in his own right. The reigning Finals MVP brings relentless energy on both ends of the floor. His explosive drives, improving three-point shot, and suffocating perimeter defense make him one of the most complete two-way guards in the NBA.",
  'jalen-hurts':
    "Jalen Hurts has evolved into one of the NFL's most dangerous dual-threat quarterbacks. His combination of arm strength, rushing ability, and fourth-quarter composure makes the Eagles offense nearly impossible to stop. Hurts' leadership and work ethic have transformed Philadelphia into a perennial contender.",
  'saquon-barkley':
    "Saquon Barkley's move to Philadelphia unlocked a historic season. Behind the Eagles' dominant offensive line, Barkley's rare combination of power, speed, and agility produced a 2,000-yard rushing campaign. His ability to break tackles and hit the home run play makes him the most electrifying runner in football.",
  'lebron-james':
    "LeBron James continues to defy the aging curve in his 21st NBA season. The all-time leading scorer combines elite court vision with an unmatched basketball IQ. His ability to elevate teammates while still producing at an All-Star level makes him a singular force in NBA history.",
  'luka-doncic':
    "Luka Doncic is a once-in-a-generation offensive talent who puts up video-game numbers on a nightly basis. His combination of step-back shooting, elite passing, and relentless rebounding from the guard position is historically unprecedented. Doncic's ability to control the tempo and create for others makes Dallas a threat in any playoff series.",
  'nikola-jokic':
    "Nikola Jokic is the most unique offensive player in NBA history. The three-time MVP orchestrates Denver's offense with otherworldly passing for a 7-footer while dominating the glass and scoring with surgical efficiency. His basketball IQ and feel for the game are unmatched by any player in the league.",
  'shai-gilgeous-alexander':
    "Shai Gilgeous-Alexander has emerged as the NBA's most complete two-way player. His silky mid-range game, crafty drives, and elite steal rate make him a nightmare for opposing guards. SGA's quiet confidence and relentless competitiveness have propelled OKC from rebuilding to championship contention.",
  'giannis-antetokounmpo':
    "Giannis Antetokounmpo is the most physically dominant force in basketball. The Greek Freak's combination of size, speed, and skill at 6'11\" is unlike anything the NBA has ever seen. His relentless attacks on the rim, improving playmaking, and defensive versatility make him a perennial MVP candidate.",
  'stephen-curry':
    "Stephen Curry is the greatest shooter in basketball history and the player who revolutionized the modern NBA. Even at 36, his gravity warps defenses and creates opportunities for everyone around him. Curry's combination of limitless range, elite ball-handling, and clutch performance continues to make the Warriors a must-watch team.",
  'patrick-mahomes':
    "Patrick Mahomes is the most talented quarterback of his generation and a three-time Super Bowl champion. His ability to make throws from impossible angles, extend plays, and deliver in the biggest moments defines modern greatness. Mahomes' combination of arm talent and football IQ makes the Chiefs offense perpetually elite.",
  'josh-allen':
    "Josh Allen is a physical marvel at the quarterback position, combining a cannon arm with running back-like rushing ability. His ability to carry the Bills offense on his shoulders with both his arm and legs makes him one of the most dangerous players in the NFL.",
  'lamar-jackson':
    "Lamar Jackson has redefined what a quarterback can be in the modern NFL. The two-time MVP combines elite passing with game-breaking rushing ability, making him virtually impossible to defend. His growth as a passer while maintaining his otherworldly rushing threat has made Baltimore's offense the most dynamic in football.",
  'anthony-edwards':
    "Anthony Edwards is the NBA's next great superstar. His explosive athleticism, fearless shot-making, and infectious personality make him must-see television. Ant-Man's scoring ability, combined with improving defense and playmaking, has the Timberwolves positioned as a legitimate championship contender.",
  'kevin-durant':
    "Kevin Durant remains one of the purest scorers the game has ever seen. At 6'10\" with guard-like skills, his combination of length, shooting touch, and scoring versatility makes him virtually unguardable. KD's ability to get a bucket from anywhere on the court at any time is a rare gift.",
  'aj-brown':
    "A.J. Brown is one of the NFL's most physically dominant wide receivers. His combination of size, speed, and physicality after the catch makes him a nightmare matchup for any defensive back. Brown's connection with Jalen Hurts has become one of the most lethal duos in football.",
  'devonta-smith':
    "DeVonta Smith is one of the smoothest route runners in the NFL. The Heisman Trophy winner uses elite agility and precise footwork to consistently create separation. His ability to win at every level of the route tree makes him a reliable target in Philadelphia's high-powered offense.",
};

const whyMatters: Record<string, string> = {
  'jayson-tatum': 'Tatum is the face of a Celtics dynasty in the making and a legitimate MVP frontrunner.',
  'jaylen-brown': 'Brown proved in the Finals that he can be the best player on a championship team.',
  'jalen-hurts': 'Hurts has transformed into a franchise quarterback who makes the Eagles a Super Bowl threat every year.',
  'saquon-barkley': 'Barkley reminded the world that an elite running back can still be a game-changing weapon in the modern NFL.',
  'lebron-james': 'LeBron playing at this level in Year 21 is one of the greatest feats in the history of professional sports.',
  'luka-doncic': 'Doncic is producing at a level only seen by all-time greats, putting up historic numbers before his 26th birthday.',
  'nikola-jokic': 'Jokic has changed how the world thinks about what a center can do on a basketball court.',
  'shai-gilgeous-alexander': 'SGA has quietly become the best player on the best team in the NBA.',
  'giannis-antetokounmpo': 'Giannis combines physical dominance with relentless drive in a way the league has never seen.',
  'stephen-curry': 'Curry changed basketball forever and is still performing at an elite level deep into his career.',
  'patrick-mahomes': 'Mahomes is building a case as the greatest quarterback of all time with each passing season.',
  'josh-allen': 'Allen carries the Bills on his shoulders and is one of the few QBs who can beat you with his arm and legs.',
  'lamar-jackson': 'Jackson has proven he can be a dominant passer while remaining the most dangerous rushing QB ever.',
  'anthony-edwards': 'Edwards is the heir apparent to be the face of the NBA and is already playing like it.',
  'kevin-durant': 'KD is one of the most gifted scorers in basketball history, still operating at an elite level.',
  'aj-brown': 'Brown is the prototypical modern WR1 and a cornerstone of the Eagles offense.',
  'devonta-smith': 'Smith gives the Eagles a reliable, elite route runner who delivers in the biggest moments.',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const player = await getPlayer(slug);

  if (!player) {
    return { title: 'Player Not Found | BALL INTELLIGENCE' };
  }

  return {
    title: `${player.name} | BALL INTELLIGENCE`,
    description: `Stats, game log, and analysis for ${player.name}.`,
  };
}

export default async function PlayerPage({ params }: Props) {
  const { slug } = await params;
  const player = await getPlayer(slug);

  if (!player) {
    notFound();
  }

  // Get related players: same team first, then same position
  const [teamPlayers, allPlayers] = await Promise.all([
    getPlayersByTeam(player.teamId),
    getPlayers({ league: player.league }),
  ]);

  const relatedFromTeam = teamPlayers.filter((p) => p.slug !== player.slug);
  const relatedByPosition = allPlayers.filter(
    (p) => p.slug !== player.slug && p.position === player.position && p.teamId !== player.teamId
  );
  const relatedPlayers = [...relatedFromTeam, ...relatedByPosition].slice(0, 4);

  const summary = playerSummaries[player.slug] || player.bio || '';
  const whyMatter = whyMatters[player.slug] || '';

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <PlayerHero player={player} />

        {/* Season Stats */}
        <section>
          <h2 className="text-xl font-bold text-text mb-4">Season Stats</h2>
          <PlayerStatsGrid stats={player.seasonStats} league={player.league} />
        </section>

        {/* Game Log */}
        <section>
          <h2 className="text-xl font-bold text-text mb-4">Recent Games</h2>
          <div className="bg-surface border border-border rounded-xl overflow-hidden">
            <PlayerGameLog player={player} />
          </div>
        </section>

        {/* AI Player Analysis (powered by Claude) */}
        <AIPlayerAnalysis player={player} fallbackSummary={summary} />

        {/* Why This Player Matters */}
        {whyMatter && (
          <section className="bg-surfaceLight border border-border rounded-xl p-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-accent mb-2">
              Why This Player Matters
            </h3>
            <p className="text-text text-sm leading-relaxed">{whyMatter}</p>
          </section>
        )}

        {/* Related Players */}
        {relatedPlayers.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-text mb-4">Related Players</h2>
            <RelatedPlayers players={relatedPlayers} />
          </section>
        )}
      </div>
    </main>
  );
}
