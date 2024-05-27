import { useRouter } from 'next/router';
import useSWR from 'swr';
import { fetcher, updateTournament, deleteTournament, createTeam, updateTeam, deleteTeam } from '../../utils/api';
import Header from '../../components/Header';
import TournamentDetails from '../../components/TournamentDetails';
import { Tournament } from '../../types/Tournament';
import { Team } from '../../types/Team';
import React from 'react';

const TournamentPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data, error, mutate } = useSWR<Tournament>(id ? `/tournament/${id}` : null, fetcher);

  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;

  const handleUpdate = async (tournament: Tournament) => {
    await updateTournament(tournament);
    mutate();
  };

  const handleDelete = async () => {
    confirm("Are you sure you want to delete this tournament?")
    await deleteTournament(data.t_id);
    router.push('/tournaments');
  };

  const handleCreateTeam = async (team: Team) => {
    await createTeam(team, data.t_id);
    mutate();
  };

  const handleUpdateTeam = async (team: Team) => {
    await updateTeam(team);
    mutate();
  };

  const handleDeleteTeam = async (teamId: number) => {
    confirm("Are you sure you want to delete this team?")
    await deleteTeam(teamId);
    mutate();
  };

  return (
    <>
      <Header />
      <main className="container mx-auto mt-8 flex justify-center">
        <TournamentDetails
          tournament={data}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onCreateTeam={handleCreateTeam}
          onUpdateTeam={handleUpdateTeam}
          onDeleteTeam={handleDeleteTeam}
        />
      </main>
    </>
  );
};

export default TournamentPage;
