'use client';

import { UsersList } from '@/app/gamification-demo/UsersList';
import { TeamsList } from '@/app/gamification-demo/TeamsList';
import { MetricsList } from '@/app/gamification-demo/MetricsList';
import { BadgesList } from '@/app/gamification-demo/BadgesList';
import { ObjectivesList } from '@/app/gamification-demo/ObjectivesList';

export default function GamificationDemo() {
  return (
    <div className="p-6 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <UsersList />
        <TeamsList />
        <MetricsList />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <BadgesList />
        <ObjectivesList />
      </div>
    </div>
  );
}
