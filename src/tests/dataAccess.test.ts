import { fetchTournamentStructures, fetchTournamentStatuses } from '../utils/api';

test('fetchTournamentStructures returns correct data', async () => {
  const structures = await fetchTournamentStructures();
  expect(structures).toEqual([
    { id: 1, name: 'Structure 1' },
    { id: 2, name: 'Structure 2' },
  ]);
});

test('fetchTournamentStatuses returns correct data', async () => {
  const statuses = await fetchTournamentStatuses();
  expect(statuses).toEqual([
    { id: 1, name: 'Status 1' },
    { id: 2, name: 'Status 2' },
  ]);
});
