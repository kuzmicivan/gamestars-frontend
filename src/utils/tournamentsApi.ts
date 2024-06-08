import axios from "axios";
import { Tournament } from "../types/Tournament";

const tournamentsApi = axios.create({
  baseURL: "http://localhost:8080/",
});

export const fetcher = (url: string) =>
  tournamentsApi.get(url).then((res) => res.data);

export const fetchTournaments = (): Promise<Tournament[]> => {
  return tournamentsApi.get("/tournaments").then((res) => res.data);
};

export const createTournament = (tournament: Tournament, user: string) => {
  return tournamentsApi
    .post("/tournament", { ...tournament, user })
    .then((res) => res.data);
};

export default tournamentsApi;
