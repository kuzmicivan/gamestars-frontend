import React, { useState } from "react";
import { submitTaskForm } from "../utils/camundaApi";
import NewTournamentForm from "./NewTournamentForm";
import Modal from "./Modal";
import { useRouter } from "next/router";

const Task = ({ task, user, refreshTasks, mutate }) => {
  const [formData, setFormData] = useState({ checker: "" });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [taskVariables, setTaskVariables] = useState({});
  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const variables = { checker: { value: formData.checker, type: "String" } };
    await submitTaskForm(task.id, variables);
    refreshTasks();
  };

  const openEditForm = (variables) => {
    const formattedVariables = Object.keys(variables).reduce((acc, key) => {
      acc[key] = variables[key].value;
      return acc;
    }, {});
    setTaskVariables(formattedVariables);
    setIsFormOpen(true);
  };

  const handleApprove = async () => {
    const variables = { checkNeeded: { value: false, type: "Boolean" } };
    await submitTaskForm(task.id, variables);
    refreshTasks();
    mutate();
  };

  const handleRequestRevision = async () => {
    const variables = { checkNeeded: { value: true, type: "Boolean" } };
    await submitTaskForm(task.id, variables);
    refreshTasks();
  };

  const handleFixTournamentInfo = async ({
    name,
    prize_fond,
    start_date,
    end_date,
  }) => {
    const variables = {
      name: { value: name, type: "String" },
      prizeFond: { value: prize_fond, type: "String" },
      startDate: { value: start_date, type: "String" },
      endDate: { value: end_date, type: "String" },
    };
    await submitTaskForm(task.id, variables);
    refreshTasks();
  };

  return (
    <div className="border p-4 mb-4 bg-gray-800 border-gray-700">
      <h3 className="text-xl font-bold">{task.name}</h3>
      <p>Assignee: {task.assignee}</p>
      <p>Created: {new Date(task.created).toLocaleString()}</p>
      {task.name === "Assign create tournament checker" &&
        user.group === "administrator" && (
          <form onSubmit={handleFormSubmit}>
            <div className="mb-4">
              <label className="block text-gray-300" htmlFor="checker">
                Checker
              </label>
              <input
                id="checker"
                name="checker"
                placeholder="Checker"
                className="border p-2 w-full bg-gray-700 border-gray-600 text-white outline-green-400"
                type="text"
                value={formData.checker}
                onChange={handleInputChange}
              />
            </div>
            <button
              className="bg-green-600 hover:bg-green-400 text-white font-bold py-2 px-4 rounded"
              type="submit"
            >
              Assign Checker
            </button>
          </form>
        )}
      {task.name === "Create check" && user.group === "checker" && (
        <>
          <button
            className="bg-green-600 hover:bg-green-400 text-white font-bold py-2 px-4 rounded"
            onClick={() => openEditForm(task.variables)}
          >
            Review Tournament
          </button>
          {isFormOpen && (
            <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)}>
              <NewTournamentForm
                onClose={() => setIsFormOpen(false)}
                initialData={taskVariables}
                readOnly
                onCreate={undefined}
              />
              <div className="mt-4 flex justify-between">
                <button
                  className="bg-green-600 hover:bg-green-400 text-white font-bold py-2 px-4 rounded"
                  onClick={handleApprove}
                >
                  Approve
                </button>
                <button
                  className="bg-red-600 hover:bg-red-400 text-white font-bold py-2 px-4 rounded"
                  onClick={handleRequestRevision}
                >
                  Request Revision
                </button>
              </div>
            </Modal>
          )}
        </>
      )}
      {task.name === "Fix tournament info" && user.group === "user" && (
        <>
          <button
            className="bg-green-600 hover:bg-green-400 text-white font-bold py-2 px-4 rounded"
            onClick={() => openEditForm(task.variables)}
          >
            Fix Tournament Info
          </button>
          {isFormOpen && (
            <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)}>
              <NewTournamentForm
                onClose={() => setIsFormOpen(false)}
                initialData={taskVariables}
                onCreate={handleFixTournamentInfo}
                readOnly={undefined}
              />
            </Modal>
          )}
        </>
      )}
    </div>
  );
};

export default Task;
