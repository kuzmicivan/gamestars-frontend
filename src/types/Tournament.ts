import { Team } from './Team';

export interface Tournament {
  t_id: number;
  name: string;
  tournament_structure_id: number;
  tournament_status_id: number;
  start_date: string;
  end_date: string;
  prize_fond: string;
  teams: Team[];
}
