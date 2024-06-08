import React, { useState } from "react";

const NewTournamentForm = ({ onClose, onCreate, initialData, readOnly }) => {
  const [name, setName] = useState(initialData?.name || "");
  const [prizeFond, setPrizeFond] = useState(initialData?.prizeFond || "");
  const [startDate, setStartDate] = useState(initialData?.startDate || "");
  const [endDate, setEndDate] = useState(initialData?.endDate || "");
  const [errors, setErrors] = useState([]);

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

    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();
    setErrors(errors);
    if (errors.length === 0) {
      onCreate({
        name: name,
        prize_fond: prizeFond,
        start_date: startDate,
        end_date: endDate,
      });
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
          readOnly={readOnly}
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
          readOnly={readOnly}
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
          readOnly={readOnly}
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
          readOnly={readOnly}
        />
      </div>
      {!readOnly && (
        <button
          className="bg-green-600 w-full hover:bg-green-400 text-white font-bold py-2 px-4 rounded"
          type="submit"
        >
          Create Tournament
        </button>
      )}
    </form>
  );
};

export default NewTournamentForm;
