import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { fetchTournaments, createTournament, updateTournament, deleteTournament } from '../utils/api';

const mock = new MockAdapter(axios);

const tournaments = [
  { t_id: 1, name: 'Tournament 1', tournament_structure_id: 1, tournament_status_id: 1, start_date: '2024-06-01', end_date: '2024-06-10', prize_fond: '5000 USD', teams: [{ t_id: 1, name: 'Team 1', description: 'Team 1 description' }, { t_id: 2, name: 'Team 2', description: 'Team 2 description' }] },
  { t_id: 2, name: 'Tournament 2', tournament_structure_id: 2, tournament_status_id: 2, start_date: '2024-06-15', end_date: '2024-06-25', prize_fond: '3000 USD', teams: [{ t_id: 3, name: 'Team 3', description: 'Team 3 description' }, { t_id: 4, name: 'Team 4', description: 'Team 4 description' }] },
];

describe('API tests', () => {
  afterEach(() => {
    mock.reset();
  });

  test('fetchTournaments', async () => {
    mock.onGet('/tournaments').reply(200, tournaments);

    const response = await fetchTournaments();
    expect(response).toEqual(tournaments);
  });

  test('createTournament', async () => {
    const newTournament = { t_id: 3, name: 'Tournament 3', tournament_structure_id: 3, tournament_status_id: 3, start_date: '2024-07-01', end_date: '2024-07-10', prize_fond: '7000 USD', teams: [] };
    mock.onPost('/tournaments').reply(200, newTournament);

    await createTournament(newTournament);
    mock.onGet('/tournaments').reply(200, [...tournaments, newTournament]);
    const response = await fetchTournaments();
    expect(response).toContainEqual(newTournament);
  });

  test('updateTournament', async () => {
    const updatedTournament = { ...tournaments[0], name: 'Updated Tournament 1' };
    mock.onPut(`/tournaments/${updatedTournament.t_id}`).reply(200, updatedTournament);

    await updateTournament(updatedTournament);
    mock.onGet('/tournaments').reply(200, [updatedTournament, tournaments[1]]);
    const response = await fetchTournaments();
    expect(response).toContainEqual(updatedTournament);
  });

  test('deleteTournament', async () => {
    const t_id = 1;
    mock.onDelete(`/tournaments/${t_id}`).reply(200);

    await deleteTournament(t_id);
    mock.onGet('/tournaments').reply(200, tournaments.filter(t => t.t_id !== t_id));
    const response = await fetchTournaments();
    expect(response).not.toContainEqual(expect.objectContaining({ t_id }));
  });
});
