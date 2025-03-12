export const TEAM_XP_DISTRIBUTION = {
  /**
   * Formula:
   * XP per member = Total XP * (Individual contribution / Total team contribution)
   */
  proportional: 'proportional',
  /**
   * Formula:
   * XP per member = Total XP / Total team members
   */
  equal: 'equal',
} as const;
