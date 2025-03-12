import axios, { AxiosInstance } from 'axios';
import UserService from './services/UserService';
import MetricService from './services/MetricService';
import TeamService from './services/TeamService';
import ObjectiveService from './services/ObjectiveService';
import BadgeService from './services/BadgeService';
import ConditionService from './services/ConditionService';

export type HeadlessGamifyProps = {
  API_BASE_URL: string;
  API_KEY: string;
};

export class HeadlessGamify {
  private instance: AxiosInstance;
  users: UserService;
  metrics: MetricService;
  teams: TeamService;
  objectives: ObjectiveService;
  badges: BadgeService;
  conditions: ConditionService;
  constructor(props: HeadlessGamifyProps) {
    if (!props.API_BASE_URL) throw new Error('API_BASE_URL is required');
    if (!props.API_KEY) throw new Error('API_KEY is required');
    this.instance = axios.create({
      baseURL: props.API_BASE_URL,
      headers: {
        'x-api-key': props.API_KEY,
        'Content-Type': 'application/json',
      },
    });
    this.users = new UserService(this.instance);
    this.metrics = new MetricService(this.instance);
    this.teams = new TeamService(this.instance);
    this.objectives = new ObjectiveService(this.instance);
    this.badges = new BadgeService(this.instance);
    this.conditions = new ConditionService(this.instance);
  }
}
