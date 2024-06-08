import { useState, useEffect } from "react";
import type { NextPage } from "next";
import useSWR from "swr";
import { fetcher, createTournament } from "../utils/tournamentsApi";
import { fetchTasksForUser, fetchTasksForGroup } from "../utils/camundaApi";
import Header from "../components/Header";
import { Tournament } from "../types/Tournament";
import Modal from "../components/Modal";
import NewTournamentForm from "../components/NewTournamentForm";
import Task from "../components/Task";
import React from "react";
import { useRouter } from "next/router";

enum Group {
  USER = "user",
  ADMINISTRATOR = "administrator",
  CHECKER = "checker",
}

const users = [
  {
    username: "paula",
    password: "paula",
    group: Group.USER,
  },
  {
    username: "ivan",
    password: "ivan",
    group: Group.ADMINISTRATOR,
  },
  {
    username: "luka",
    password: "luka",
    group: Group.CHECKER,
  },
];

const TournamentsPage: NextPage = () => {
  const router = useRouter();
  const user = router.query.user as string;
  const [userTasks, setUserTasks] = useState([]);
  const { data, error, mutate } = useSWR<Tournament[]>("/tournaments", fetcher);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      let tasks;
      const userGroup = users.find((u) => u.username === user)?.group;
      if (userGroup === Group.USER) {
        tasks = await fetchTasksForUser(user);
      } else if (userGroup === Group.ADMINISTRATOR) {
        tasks = await fetchTasksForGroup("administrator");
      } else if (userGroup === Group.CHECKER) {
        tasks = await fetchTasksForUser(user);
      }
      setUserTasks(tasks);
    };

    if (user && users.find((u) => u.username === user)) {
      fetchTasks();
    }
  }, [user]);

  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;

  const handleCreate = async (tournament: Tournament) => {
    await createTournament(tournament, user);
    mutate();
  };

  const filteredTournaments = data.filter((tournament) =>
    tournament.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const refreshTasks = async () => {
    const tasks = await fetchTasksForUser(user);
    setUserTasks(tasks);
  };

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
          {user && users.find((u) => u.username === user) && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-green-600 hover:bg-green-400 text-nowrap h-12 text-white font-bold py-2 px-4 rounded mb-4"
            >
              Create New Tournament
            </button>
          )}
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
                    <p className="text-md font-light">
                      {tournament.prize_fond}
                    </p>
                  </div>
                  <div>
                    <p className="text-green-400 text-lg font-semibold">
                      Start Date
                    </p>
                    <p className="text-md font-light">
                      {tournament.start_date}
                    </p>
                  </div>
                  <div>
                    <p className="text-green-400 text-lg font-semibold">
                      End Date
                    </p>
                    <p className="text-md font-light">{tournament.end_date}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <NewTournamentForm
            onClose={() => setIsModalOpen(false)}
            onCreate={handleCreate}
            initialData={undefined}
            readOnly={undefined}
          />
        </Modal>

        <div className="mt-10">
          <h2 className="text-3xl font-bold mb-4">Tasks</h2>
          {userTasks.length > 0 ? (
            userTasks.map((task: any) => (
              <Task
                key={task.id}
                task={task}
                user={users.find((u) => u.username === user)}
                refreshTasks={refreshTasks}
                mutate={mutate}
              />
            ))
          ) : (
            <p>No tasks available</p>
          )}
        </div>
      </main>
    </>
  );
};

export default TournamentsPage;
