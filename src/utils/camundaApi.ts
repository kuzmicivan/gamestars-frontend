import axios from "axios";

const backendBaseUrl = "http://localhost:8080/camunda";

export const fetchTasksForUser = async (username: string) => {
  const response = await axios.get(
    `${backendBaseUrl}/tasks/assignee/${username}`
  );
  return response.data;
};

export const fetchTasksForGroup = async (group: string) => {
  const response = await axios.get(`${backendBaseUrl}/tasks/group/${group}`);
  return response.data;
};

export const submitTaskForm = async (taskId: string, variables: any) => {
  const response = await axios.post(
    `${backendBaseUrl}/tasks/${taskId}/submit-form`,
    variables
  );
  return response.data;
};
