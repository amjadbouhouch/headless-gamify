import { objectiveValidator } from '@headless-gamify/common';
import { HTTPException } from 'hono/http-exception';
import { Company, Objective, ObjectiveTracker, Prisma } from './prisma';
import { teamService } from 'src/services/team.service';

export namespace objectiveHelper {
  export type GetMembersIdsArgs = {
    payload: Partial<objectiveValidator.Create>;
    company: Company;
  };
  export async function getMembersIds({ company, payload }: GetMembersIdsArgs) {
    const membersIds: string[] = [];
    if (payload.teamId) {
      // team work
      const team = await teamService.retrieve({ company, id: payload.teamId });
      if (!team) {
        throw new HTTPException(404, { message: `Team not found with id = ${payload.teamId}` });
      }

      team.members.forEach((member) => {
        membersIds.push(member.id);
      });
    } else {
      membersIds.push(...(payload.users ?? []));
    }
    return membersIds;
  }
  //
  type IncrementObjectiveTrackerType = {
    //  full objective with objectiveTrackers
    objective: Prisma.ObjectiveGetPayload<{
      include: {
        objectiveTracker: true;
      };
    }>;
    // transaction
    tx: Prisma.TransactionClient;
    // increment by value
    value: number;
  };

  // returns rewardXP if completed or 0 if not
  export async function incrementObjectiveTracker({ objective, tx, value }: IncrementObjectiveTrackerType) {
    let totalRewardedXP = 0;
    for (const objectiveTracker of objective.objectiveTracker) {
      if (!objectiveTracker) {
        continue;
      }
      const isAlreadyCompleted = objectiveTracker.completed;
      const progress = objectiveTracker.progress + value;
      const isCompleted = progress >= objective.targetValue;
      await tx.objectiveTracker.update({
        where: {
          id: objectiveTracker.id,
        },
        data: {
          progress,
          completed: isCompleted,
          completedAt: isAlreadyCompleted ? undefined : isCompleted ? new Date() : null,
        },
      });
      if (isCompleted && !isAlreadyCompleted) {
        totalRewardedXP += objective.rewardXp;
      }
    }
    return totalRewardedXP;
  }
}
