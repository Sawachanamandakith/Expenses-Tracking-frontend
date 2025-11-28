import axios from "axios";

axios.defaults.baseURL = "http://localhost:60748";

const getUserID = () => localStorage.getItem("UserID");

// GET ALL TASKS
export const getAllTasks = async () => {
  const userId = getUserID();
  try {
    const { data } = await axios.get(`/TaskBudget/GetAllTasks?userId=${userId}`);
    console.log("Fetched all tasks:", data);
    return data;
  } catch (error) {
    console.error(
      "Error fetching tasks:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

// GET TASK BY ID
export const getTaskById = async (taskId) => {
  try {
    const { data } = await axios.get(`/TaskBudget/GetTaskById?taskId=${taskId}`);
    console.log("Fetched task by ID:", data);
    return data;
  } catch (error) {
    console.error(
      "Error fetching task by ID:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

// // ADD NEW TASK

export const addTask = async (taskData) => {
  taskData.UserID = getUserID();

  console.log("Sending new Task to backend:", taskData);

  try {
    const { data } = await axios.post("/TaskBudget/AddTask", taskData);
    console.log("Task added successfully:", data);
    return data;
  } catch (error) {
    console.error(
      "Error adding task:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

// UPDATE TASK
export const updateTask = async (taskData) => {
  taskData.UserID = getUserID();

  console.log("Sending task update to backend:", taskData);

  try {
    const { data } = await axios.post("/TaskBudget/UpdateTask", taskData);
    console.log("Task updated successfully:", data);
    return data;
  } catch (error) {
    console.error(
      "Error updating task:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

// DELETE TASK
export const deleteTask = async (taskData) => {
  taskData.UserID = getUserID();

  console.log("Deleting task:", taskData);

  try {
    const { data } = await axios.post("/TaskBudget/DeleteTask", taskData);
    console.log("Task deleted successfully:", data);
    return data;
  } catch (error) {
    console.error(
      "Error deleting task:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

// // GET ALL ITEMS OF A TASK
export const getTaskItems = async (taskId) => {
  try {
    const { data } = await axios.get(`/TaskBudget/GetTaskItems?taskId=${taskId}`);
    console.log("Fetched task items:", data);
    return data;
  } catch (error) {
    console.error(
      "Error fetching task items:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};


// ADD TASK ITEM
export const addTaskItem = async (itemData) => {
  itemData.UserID = getUserID();

  console.log("Sending new task item to backend:", itemData);

  try {
    const { data } = await axios.post("/TaskBudget/AddTaskItem", itemData);
    console.log("Task item added successfully:", data);
    return data;
  } catch (error) {
    console.error(
      "Error adding task item:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

// UPDATE TASK ITEM
export const updateTaskItem = async (itemData) => {
  itemData.UserID = getUserID();

  console.log("Updating task item:", itemData);

  try {
    const { data } = await axios.post("/TaskBudget/UpdateTaskItem", itemData);
    console.log("Task item updated successfully:", data);
    return data;
  } catch (error) {
    console.error(
      "Error updating task item:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

// DELETE TASK ITEM
export const deleteTaskItem = async (itemData) => {
  itemData.UserID = getUserID();

  console.log("Deleting task item:", itemData);

  try {
    const { data } = await axios.post("/TaskBudget/DeleteTaskItem", itemData);
    console.log("Task item deleted successfully:", data);
    return data;
  } catch (error) {
    console.error(
      "Error deleting task item:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

// RECALCULATE TASK TOTAL
export const recalculateTaskTotal = async (taskData) => {
  taskData.UserID = getUserID();

  console.log("Recalculating task total:", taskData);

  try {
    const { data } = await axios.post("/TaskBudget/RecalculateTaskTotal", taskData);
    console.log("Task total recalculated successfully:", data);
    return data;
  } catch (error) {
    console.error(
      "Error recalculating task total:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};
