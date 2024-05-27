import { useState } from "react";
import type { NextPage } from "next";
import useSWR from "swr";
import { fetcher, deleteTournament, createTournament } from "../../utils/api";
import Header from "../../components/Header";
import { Tournament } from "../../types/Tournament";
import Link from "next/link";
import Modal from "../../components/Modal";
import NewTournamentForm from "../../components/NewTournamentForm";
import React from "react";
import { EyeIcon, TrashIcon } from "@heroicons/react/16/solid";
import { Team } from "@/types/Team";

const TournamentsPage: NextPage = () => {
  const { data, error, mutate } = useSWR<Tournament[]>("/tournaments", fetcher);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");


  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;

  const handleDelete = async (id: number) => {
    confirm("Are you sure you want to delete this tournament?")
    await deleteTournament(id);
    mutate();
  };

  const handleCreate = async (tournament: Tournament, teams?: Team[]) => {
    await createTournament(tournament, teams);
    mutate();
  };

  const filteredTournaments = data.filter((tournament) =>
    tournament.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Header />
      <main className="container mx-auto mt-8 text-white w-2/3">
        <div className="flex justify-between items-center mb-10">
          <div className="w-full">
            <h1 className="text-3xl font-bold mb-4">Tournaments</h1>
            <div className="w-1/4">
              <input
                type="text"
                placeholder="Search tournaments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border p-2 w-full bg-gray-700 border-gray-600 text-white outline-green-400"
              />
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-green-600 hover:bg-green-400 text-nowrap h-12 text-white font-bold py-2 px-4 rounded mb-4"
          >
            Create New Tournament
          </button>
        </div>
        {filteredTournaments.map((tournament) => (
          <div
            key={tournament.t_id}
            className="flex justify-between border p-4 mb-4 bg-gray-800 border-gray-700"
          >
            <div className="w-full">
              <h2 className="text-2xl font-bold">{tournament.name}</h2>
              <div className="w-full h-1 bg-green-400 mb-2" />
              <div className="w-full flex justify-between">
              <div className="grid grid-cols-3 w-full">
                <div>
                  <p className="text-green-400 text-lg font-semibold">
                    Prize Fund
                  </p>
                  <p className="text-md font-light">{tournament.prize_fond}</p>
                </div>
                <div>
                  <p className="text-green-400 text-lg font-semibold">
                    Start Date
                  </p>
                  <p className="text-md font-light">{tournament.start_date}</p>
                </div>
                <div>
                  <p className="text-green-400 text-lg font-semibold">
                    End Date
                  </p>
                  <p className="text-md font-light">{tournament.end_date}</p>
                </div>
              </div>
              <div className="flex justify-center items-center gap-2">
                <Link
                  href={`/tournaments/${tournament.t_id}`}
                  className="bg-gray-500 hover:bg-gray-400 flex justify-center h-fit items-center text-white font-bold py-2 px-2 rounded"
                >
                  <EyeIcon className="w-6 h-6" />
                </Link>
                <button
                  onClick={() => handleDelete(tournament.t_id)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-2 rounded h-fit"
                >
                  <TrashIcon className="w-6 h-6" />
                </button>
              </div>
              </div>
            </div>
          </div>
        ))}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <NewTournamentForm
            onClose={() => setIsModalOpen(false)}
            onCreate={handleCreate}
          />
        </Modal>
      </main>
    </>
  );
};

export default TournamentsPage;
