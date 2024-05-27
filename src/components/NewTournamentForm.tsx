import React, { useState, useEffect } from "react";
import {
  fetchTournamentStructures,
  fetchTournamentStatuses,
} from "../utils/api";

const NewTournamentForm = ({ onClose, onCreate }) => {
  const [name, setName] = useState("");
  const [prizeFond, setPrizeFond] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [tournamentStructureId, setTournamentStructureId] = useState("");
  const [tournamentStatusId, setTournamentStatusId] = useState("");
  const [structures, setStructures] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [errors, setErrors] = useState([]);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedStructures = await fetchTournamentStructures();
      const fetchedStatuses = await fetchTournamentStatuses();
      setStructures(fetchedStructures);
      setStatuses(fetchedStatuses);
    };
    fetchData();
  }, []);

  const handleAddTeam = () => {
    setTeams([...teams, { name: "", description: "" }]);
  };

  const handleRemoveTeam = (index) => {
    const newTeams = teams.slice();
    newTeams.splice(index, 1);
    setTeams(newTeams);
  };

  const handleTeamChange = (index, field, value) => {
    const newTeams = teams.slice();
    newTeams[index][field] = value;
    setTeams(newTeams);
  };

  const validateForm = () => {
    const errors = [];
    if (!name) {
      errors.push("Tournament name is required");
    } else if (name.length < 4) {
      errors.push("Tournament name must be at least 4 characters long");
    }
    if (!prizeFond) {
      errors.push("Prize fund is required");
    } else if (isNaN(Number.parseFloat(prizeFond)) || Number(prizeFond) <= 0) {
      errors.push("Prize fund must be a positive number");
    }
    if (!startDate) {
      errors.push("Start date is required");
    }
    if (!endDate) {
      errors.push("End date is required");
    } else if (new Date(endDate) < new Date(startDate)) {
      errors.push("End date cannot be before start date");
    }
    if (!tournamentStatusId) {
      errors.push("Tournament status is required");
    }
    if (!tournamentStructureId) {
      errors.push("Tournament structure is required");
    }

    teams.forEach((team, index) => {
      if (!team.name) {
        errors.push(`Team ${index + 1}: Team name is required`);
      }
      if (!team.description) {
        errors.push(`Team ${index + 1}: Description is required`);
      }
    });

    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();
    setErrors(errors);
    if (errors.length === 0) {
      onCreate(
        {
          name,
          prize_fond: prizeFond,
          start_date: startDate,
          end_date: endDate,
          tournament_structure_id: tournamentStructureId,
          tournament_status_id: tournamentStatusId,
        },
        teams
      );
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="text-white">
      {errors.length > 0 && (
        <div className="mb-4 p-2 bg-red-600 text-white">
          {errors.map((error, index) => (
            <p key={index}>{error}</p>
          ))}
        </div>
      )}
      <div className="mb-4">
        <label className="block text-gray-300" htmlFor="name">
          Name
        </label>
        <input
          id="name"
          placeholder="Tournament Name"
          className="border p-2 w-full bg-gray-700 border-gray-600 text-white outline-green-400"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-300" htmlFor="prize_fond">
          Prize Fund
        </label>
        <input
          id="prize_fond"
          placeholder="Prize Fund"
          className="border p-2 w-full bg-gray-700 border-gray-600 text-white outline-green-400"
          type="number"
          value={prizeFond}
          onChange={(e) => setPrizeFond(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-300" htmlFor="start_date">
          Start Date
        </label>
        <input
          id="start_date"
          placeholder="Start Date"
          className="border p-2 w-full bg-gray-700 border-gray-600 text-white outline-green-400"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-300" htmlFor="end_date">
          End Date
        </label>
        <input
          id="end_date"
          placeholder="End Date"
          className="border p-2 w-full bg-gray-700 border-gray-600 text-white outline-green-400"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-300">Tournament Structure</label>
        <select
          className="border p-2 w-full bg-gray-700 border-gray-600 text-white outline-green-400"
          value={tournamentStructureId}
          onChange={(e) => setTournamentStructureId(e.target.value)}
        >
          <option value="">Select a structure</option>
          {structures.map((structure) => (
            <option key={structure.key} value={structure.key}>
              {structure.value}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-gray-300">Tournament Status</label>
        <select
          className="border p-2 w-full bg-gray-700 border-gray-600 text-white outline-green-400"
          value={tournamentStatusId}
          onChange={(e) => setTournamentStatusId(e.target.value)}
        >
          <option value="">Select a status</option>
          {statuses.map((status) => (
            <option key={status.key} value={status.key}>
              {status.value}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2 text-gray-300">Teams</h2>
        {teams.length > 0 && (
          <div className="h-80 overflow-scroll">
            {teams.map((team, index) => (
              <div
                key={index}
                className="mb-4 p-4 bg-gray-700 border border-gray-600 rounded"
              >
                <div className="mb-2">
                  <label
                    className="block text-gray-300"
                    htmlFor={`team_name_${index}`}
                  >
                    Team Name
                  </label>
                  <input
                    id={`team_name_${index}`}
                    placeholder="Team Name"
                    className="border p-2 w-full bg-gray-700 border-gray-600 text-white outline-green-400"
                    type="text"
                    value={team.name}
                    onChange={(e) =>
                      handleTeamChange(index, "name", e.target.value)
                    }
                  />
                </div>
                <div className="mb-2">
                  <label
                    className="block text-gray-300"
                    htmlFor={`team_description_${index}`}
                  >
                    Description
                  </label>
                  <input
                    id={`team_description_${index}`}
                    placeholder="Description"
                    className="border p-2 w-full bg-gray-700 border-gray-600 text-white outline-green-400"
                    type="text"
                    value={team.description}
                    onChange={(e) =>
                      handleTeamChange(index, "description", e.target.value)
                    }
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveTeam(index)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  Remove Team
                </button>
              </div>
            ))}
          </div>
        )}
        <button
          type="button"
          onClick={handleAddTeam}
          className="bg-transparent w-full border border-green-400 hover:bg-green-400 text-white font-bold py-2 px-4 rounded"
        >
          Add Team
        </button>
      </div>
      <button
        className="bg-green-600 w-full hover:bg-green-400 text-white font-bold py-2 px-4 rounded"
        type="submit"
      >
        Create Tournament
      </button>
    </form>
  );
};

export default NewTournamentForm;
