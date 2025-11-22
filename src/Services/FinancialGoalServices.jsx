import axios from "axios";
axios.defaults.baseURL = "https://expensebackend.dockyardsoftware.com";

// axios.defaults.baseURL = "http://localhost:60748";

const getUserID = () => localStorage.getItem("UserID");


//  GET ALL FINANCIAL GOALS

export const getAllFinancialGoals = async () => {
  const userId = getUserID();
  try {
    const { data } = await axios.get(`/FinancialGoal/GetAllFinancialGoals?userId=${userId}`);
    console.log("Fetched all financial goals from database:", data);
    return data;
  } catch (error) {
    console.error(
      "Error getting financial goals:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

//  ADD NEW FINANCIAL GOAL

export const addFinancialGoal = async (newGoalData) => {
  newGoalData.UserID = getUserID(); // Automatically attach UserID
  console.log("Sending new financial goal to backend:", newGoalData);

  try {
    const { data } = await axios.post("/FinancialGoal/AddFinancialGoal", newGoalData);
    console.log("Financial goal added successfully:", data);
    return data;
  } catch (error) {
    console.error(
      "Error adding financial goal:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};


//  UPDATE EXISTING FINANCIAL GOAL

export const updateFinancialGoal = async (goalData) => {
  goalData.UserID = getUserID(); // Attach UserID for backend use
  console.log("Sending financial goal update to backend:", goalData);

  try {
    const { data } = await axios.post("/FinancialGoal/UpdateFinancialGoal", goalData);
    console.log("Financial goal updated successfully:", data);
    return data;
  } catch (error) {
    console.error(
      "Error updating financial goal:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};
