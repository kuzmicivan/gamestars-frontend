import axios from "axios";
import { Tournament } from "../types/Tournament";
import { Team } from "../types/Team";

const api = axios.create({
  baseURL: "http://localhost:8080/",
});

export const fetcher = (url: string) => api.get(url).then(res => res.data);

export const fetchTournamentStructures = (): Promise<{ key: number; value: string }[]> => {
  return api.get("/tournament-structures").then(res => res.data);
};

export const fetchTournamentStatuses = (): Promise<{ key: number; value: string }[]> => {
  return api.get("/tournament-statuses").then(res => res.data);
};

export const fetchTournaments = (): Promise<Tournament[]> => {
  return api.get("/tournaments").then(res => res.data);
};

export const createTournament = (tournament: Tournament, teams?: Team[]) => {
  return api.post("/tournament",
  { ...tournament, teams }
  ).then(res => res.data);
};

export const updateTournament = (tournament: Tournament) => {
  return api.post(`/tournament/${tournament.t_id}`, tournament).then(res => res.data);
};

export const deleteTournament = (id: number) => {
  return api.delete(`/tournament/${id}`).then(res => res.data);
};

export const createTeam = (team: Team, tournamentId: number) => {
  return api.post(`/tournament/${tournamentId}/team`, team).then(res => res.data);
};

export const updateTeam = (team: Team) => {
  return api.post(`/team/${team.t_id}`, team).then(res => res.data);
};

export const deleteTeam = (teamId: number) => {
  return api.delete(`/team/${teamId}`).then(res => res.data);
};

export default api;
