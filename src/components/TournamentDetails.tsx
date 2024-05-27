import React, { useState, useEffect } from 'react';
import { Tournament } from '../types/Tournament';
import { Team } from '../types/Team';
import { fetchTournamentStructures, fetchTournamentStatuses } from '../utils/api';
import { PencilIcon, TrashIcon } from "@heroicons/react/16/solid";

interface TournamentDetailsProps {
  tournament: Tournament;
  onUpdate: (tournament: Tournament) => void;
  onDelete: () => void;
  onCreateTeam: (team: Team) => void;
  onUpdateTeam: (team: Team) => void;
  onDeleteTeam: (teamId: number) => void;
}

const TournamentDetails = ({
  tournament,
  onUpdate,
  onDelete,
  onCreateTeam,
  onUpdateTeam,
  onDeleteTeam,
}: TournamentDetailsProps) => {
  const [editing, setEditing] = useState(false);
  const [editableTournament, setEditableTournament] = useState<Tournament>({ ...tournament });
  const [newTeam, setNewTeam] = useState<Team>({ t_id: 0, name: '', description: '' });
  const [editTeam, setEditTeam] = useState<Team | null>(null);
  const [structures, setStructures] = useState<{ id: number; name: string }[]>([]);
  const [statuses, setStatuses] = useState<{ id: number; name: string }[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [teamErrors, setTeamErrors] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedStructures = await fetchTournamentStructures();
      const fetchedStatuses = await fetchTournamentStatuses();
      setStructures(fetchedStructures);
      setStatuses(fetchedStatuses);
    };
    fetchData();
  }, []);

  useEffect(() => {
    setEditableTournament({ ...tournament });
  }, [tournament]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditableTournament({ ...editableTournament, [name]: value });
  };

  const handleTeamChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editTeam) {
      setEditTeam({ ...editTeam, [name]: value });
    } else {
      setNewTeam({ ...newTeam, [name]: value });
    }
  };

  const handleAddTeam = () => {
    if (validateTeam(newTeam)) {
      onCreateTeam(newTeam);
      setNewTeam({ t_id: 0, name: '', description: '' });
    }
  };

  const handleEditTeam = (team: Team) => {
    setEditTeam(team);
  };

  const validateTournament = () => {
    const errors = [];
    if (!editableTournament.name) errors.push('Tournament name is required');
    if (editableTournament.name.length < 4) errors.push('Tournament name must be at least 4 characters long');
    if (!editableTournament.prize_fond) {
      errors.push('Prize fund is required');
    } else if (isNaN(Number(editableTournament.prize_fond)) || Number(editableTournament.prize_fond) <= 0) {
      errors.push('Prize fund must be a positive number');
    }
    if (!editableTournament.start_date) {
      errors.push('Start date is required');
    }
    if (!editableTournament.end_date) {
      errors.push('End date is required');
    } else if (new Date(editableTournament.end_date) < new Date(editableTournament.start_date)) {
      errors.push('End date cannot be before start date');
    }
    if (!editableTournament.tournament_structure_id) errors.push('Tournament structure is required');
    if (!editableTournament.tournament_status_id) errors.push('Tournament status is required');
    setErrors(errors);
    setTimeout(() => setErrors([]), 3000);
    return errors.length === 0;
  };

  const validateTeam = (team: Team) => {
    const errors = [];
    if (!team.name) errors.push('Team name is required');
    if (team.name.length < 4) errors.push('Team name must be at least 4 characters long');
    setTeamErrors(errors);
    setTimeout(() => setTeamErrors([]), 3000);
    return errors.length === 0;
  };

  const handleSaveTournament = () => {
    if (validateTournament()) {
      onUpdate(editableTournament);
      setEditing(false);
    }
  };

  const handleSaveTeam = () => {
    if (editTeam && validateTeam(editTeam)) {
      onUpdateTeam(editTeam);
      setEditTeam(null);
    }
  };

  return (
    <div className="container mx-auto mt-8 text-white w-2/3">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold">{editing ? 'Edit Tournament' : tournament.name}</h1>
        <div className='flex gap-2'>
          <button
            onClick={() => setEditing(true)}
            className="bg-gray-500 hover:bg-green-400 flex justify-center h-fit items-center text-white font-bold py-2 px-2 rounded"
          >
            <PencilIcon className='h-6 w-6'/>
          </button>
          <button
            onClick={onDelete}
            className="bg-gray-500 hover:bg-green-400 flex justify-center h-fit items-center text-white font-bold py-2 px-2 rounded"
          >
            <TrashIcon className='h-6 w-6'/>
          </button>
        </div>
      </div>
      {errors.length > 0 && (
        <div className="mb-4 p-2 bg-red-600 text-white">
          <ul>
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="border p-4 mb-4 bg-gray-800 text-white">
        {editing ? (
          <>
            <input
              type="text"
              name="name"
              value={editableTournament.name}
              onChange={handleInputChange}
              className="border p-2 mb-4 bg-gray-700 border-gray-600 w-full outline-green-400"
            />
            <input
              type="text"
              name="prize_fond"
              value={editableTournament.prize_fond}
              onChange={handleInputChange}
              className="border p-2 mb-4 bg-gray-700 border-gray-600 w-full outline-green-400"
            />
            <input
              type="date"
              name="start_date"
              value={editableTournament.start_date}
              onChange={handleInputChange}
              className="border p-2 mb-4 bg-gray-700 border-gray-600 w-full outline-green-400"
            />
            <input
              type="date"
              name="end_date"
              value={editableTournament.end_date}
              onChange={handleInputChange}
              className="border p-2 mb-4 bg-gray-700 border-gray-600 w-full outline-green-400"
            />
            <select
              name="tournament_structure_id"
              value={editableTournament.tournament_structure_id}
              onChange={handleInputChange}
              className="border p-2 mb-4 bg-gray-700 border-gray-600 w-full outline-green-400"
            >
              <option value="">Select a structure</option>
              {structures.map((structure) => (
                <option key={structure.id} value={structure.id}>{structure.name}</option>
              ))}
            </select>
            <select
              name="tournament_status_id"
              value={editableTournament.tournament_status_id}
              onChange={handleInputChange}
              className="border p-2 mb-4 bg-gray-700 border-gray-600 w-full outline-green-400"
            >
              <option value="">Select a status</option>
              {statuses.map((status) => (
                <option key={status.id} value={status.id}>{status.name}</option>
              ))}
            </select>
            <button
              onClick={handleSaveTournament}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
            >
              Save
            </button>
            <button
              onClick={() => setEditing(false)}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <div className="grid grid-flow-col w-full">
              <div>
                <p className="text-green-400 text-lg font-semibold">Prize Fund</p>
                <p className="text-md font-light">{tournament.prize_fond}</p>
              </div>
              <div>
                <p className="text-green-400 text-lg font-semibold">Start Date</p>
                <p className="text-md font-light">{tournament.start_date}</p>
              </div>
              <div>
                <p className="text-green-400 text-lg font-semibold">End Date</p>
                <p className="text-md font-light">{tournament.end_date}</p>
              </div>
              <div>
                <p className="text-green-400 text-lg font-semibold">Structure</p>
                <p className="text-md font-light">{structures.find(structure => structure.id === tournament.tournament_structure_id)?.name}</p>
              </div>
              <div>
                <p className="text-green-400 text-lg font-semibold">Status</p>
                <p className="text-md font-light">{statuses.find(status => status.id === tournament.tournament_status_id)?.name}</p>
              </div>
            </div>
          </>
        )}
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Teams</h2>
        {tournament.teams.map((team) => (
          <div key={team.t_id} className="border p-2 mb-2 bg-gray-700 border-gray-600 flex justify-between items-center">
            <div>
              <div className='flex gap-2'>
                <p className="text-lg font-semibold">Name</p>
                <p className="text-green-400 text-lg font-semibold">{team.name}</p>
              </div>
              <div className='flex gap-2'>
                <p className="text-lg font-semibold">Description</p>
                <p className="text-green-400 text-lg font-semibold">{team.description}</p>
              </div>
            </div>
            <div className='flex gap-2'>
              <button
                onClick={() => handleEditTeam(team)}
                className="bg-gray-500 hover:bg-green-400 flex justify-center h-fit items-center text-white font-bold py-2 px-2 rounded"
              >
                <PencilIcon className='h-6 w-6'/>
              </button>
              <button
                onClick={() => onDeleteTeam(team.t_id)}
                className="bg-gray-500 hover:bg-green-400 flex justify-center h-fit items-center text-white font-bold py-2 px-2 rounded"
              >
                <TrashIcon className='h-6 w-6'/>
              </button>
            </div>
          </div>
        ))}
        {editTeam ? (
          <div className="mt-4">
            <h3 className="text-xl font-bold mb-2">Edit Team</h3>
            {teamErrors.length > 0 && (
              <div className="mb-4 p-2 bg-red-600 text-white">
                <ul>
                  {teamErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
            <input
              type="text"
              name="name"
              placeholder="Team Name"
              value={editTeam.name}
              onChange={handleTeamChange}
              className="border p-2 mb-2 w-full bg-gray-700 border-gray-600 text-white outline-green-400"
            />
            <input
              type="text"
              name="description"
              placeholder="Description"
              value={editTeam.description || ''}
              onChange={handleTeamChange}
              className="border p-2 mb-2 w-full bg-gray-700 border-gray-600 text-white outline-green-400"
            />
            <button
              onClick={handleSaveTeam}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-4 px-4 rounded"
            >
              Save
            </button>
          </div>
        ) : (
          <div className="mt-4">
            <h3 className="text-xl font-bold mb-2">Add New Team</h3>
            {teamErrors.length > 0 && (
              <div className="mb-4 p-2 bg-red-600 text-white">
                <ul>
                  {teamErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
            <input
              type="text"
              name="name"
              placeholder="Team Name"
              value={newTeam.name}
              onChange={handleTeamChange}
              className="border p-2 mb-2 w-full bg-gray-700 border-gray-600 text-white outline-green-400"
            />
            <input
              type="text"
              name="description"
              placeholder="Description"
              value={newTeam.description}
              onChange={handleTeamChange}
              className="border p-2 mb-2 w-full bg-gray-700 border-gray-600 text-white outline-green-400"
            />
            <button
              onClick={handleAddTeam}
              className="bg-green-600 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mb-4"
            >
              Add Team
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TournamentDetails;
