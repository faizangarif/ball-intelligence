import { SectionHeader } from '@/components/ui/section-header';
import { BarChart3 } from 'lucide-react';

interface StatLeaderCard {
  name: string;
  value: number;
  team: string;
}

interface TopStatsSectionProps {
  nbaPointsLeader: StatLeaderCard;
  nbaAssistsLeader: StatLeaderCard;
  nflPassingLeader: StatLeaderCard;
  nflRushingLeader: StatLeaderCard;
}

function StatCard({
  category,
  leader,
  unit,
}: {
  category: string;
  leader: StatLeaderCard;
  unit?: string;
}) {
  const displayValue =
    leader.value >= 100
      ? Math.round(leader.value).toLocaleString()
      : leader.value.toFixed(1);

  return (
    <div className="bg-surface border border-border rounded-xl p-4 hover:border-accent/20 transition-all">
      <p className="text-xs uppercase text-textMuted tracking-wider font-medium mb-3">
        {category}
      </p>
      <p className="text-2xl font-black text-accent">
        {displayValue}
        {unit && <span className="text-sm font-medium text-textMuted ml-1">{unit}</span>}
      </p>
      <p className="text-lg font-bold text-text mt-1 truncate">{leader.name}</p>
      <p className="text-sm text-textMuted truncate">{leader.team}</p>
    </div>
  );
}

export function TopStatsSection({
  nbaPointsLeader,
  nbaAssistsLeader,
  nflPassingLeader,
  nflRushingLeader,
}: TopStatsSectionProps) {
  return (
    <section>
      <SectionHeader
        title="Stat Leaders"
        subtitle="Top performers across the leagues"
        href="/stats"
        action={<BarChart3 className="w-5 h-5 text-textMuted" />}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard category="Points Leader" leader={nbaPointsLeader} unit="PPG" />
        <StatCard category="Assists Leader" leader={nbaAssistsLeader} unit="APG" />
        <StatCard category="Passing Leader" leader={nflPassingLeader} unit="YDS" />
        <StatCard category="Rushing Leader" leader={nflRushingLeader} unit="YDS" />
      </div>
    </section>
  );
}
