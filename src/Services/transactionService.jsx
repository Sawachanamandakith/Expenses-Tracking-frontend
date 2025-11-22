
import axios from "axios";
axios.defaults.baseURL = 'https://expensebackend.dockyardsoftware.com';

// Helper function to get UserID from localStorage
const getUserID = () => localStorage.getItem("UserID");

export const getTransactions = async () => {
    const userId = getUserID();
    try {
        const { data } = await axios.get('/Transaction/GetAllTransactions?userId=' + userId);
        console.log("Added transactions in the database", data);
        return data;
    } catch (error) {
        console.error("Error getting transactions:", error.response ? error.response.data : error.message);
        throw error;
    }
}
//Inactive data
export const getInactiveTransactions = async () => {
    const userId = getUserID();
    try {
        const { data } = await axios.get('/Transaction/GetAllInactiveTransactions?UserID=' + userId);
        console.log("Added transactions in the database", data);
        return data;
    } catch (error) {
        console.error("Error getting transactions:", error.response ? error.response.data : error.message);
        throw error;
    }
}

export const addTransaction = async (newData) => {
    newData.UserID = getUserID(); // automatically add UserID
    console.log("Sending data:", newData);
    try {
        const { data } = await axios.post('/Transaction/AddTransaction', newData);
        console.log("Transaction is created", data);
        return data;
    } catch (error) {
        console.error("Error adding transaction:", error.response ? error.response.data : error.message);
        throw error;
    }
}


export const updateTransaction = async (transactionData) => {
  transactionData.UserID = getUserID(); 
  console.log("Sent to database for updating:", transactionData);

  try {
    const { data } = await axios.post('/Transaction/UpdateTransaction', transactionData);
    console.log("Updated transaction:", data);
    return data;
  } catch (error) {
    console.error("Error updating transaction:", error.response ? error.response.data : error.message);
    throw error;
  }
}

export const deleteTransaction = async (transactionData) => {
    transactionData.UserID = getUserID(); // ensure UserID is sent
    try {
        const { data } = await axios.post('/Transaction/DeleteTransaction', transactionData);
        console.log("Deleted transaction", data);
        return data;
    } catch (error) {
        console.error("Error deleting transaction:", error.response ? error.response.data : error.message);
        throw error;
    }
}

export const getCategories = async () => {
    const userId = getUserID();
    try {
        console.log("UserId categories", userId);
        const { data } = await axios.get('/Transaction/GetCategoryTotals?userId=' + userId);
        console.log("Get categories", data);
        return data;
    } catch (error) {
        console.error("Error getting categories:", error.response ? error.response.data : error.message);
        throw error;
    }
}

export const calculateTransactions = async (dates) => {
    const userId = getUserID();
    try {
        let url = '/Transaction/GetTotalIncomeExpense?userId=' + userId;
        if (dates?.startDate) url += '&startDate=' + encodeURIComponent(dates.startDate);
        if (dates?.endDate) url += '&endDate=' + encodeURIComponent(dates.endDate);
        const { data } = await axios.get(url);
        console.log("Calculations", data);
        return data;
    } catch (error) {
        console.error("Error rendering calculations:", error.response ? error.response.data : error.message);
        throw error;
    }
}

export const calculateCategoricalAmounts = async (dates) => {
    const userId = getUserID();
    try {
        let url = '/Transaction/GetCategoryTotals?userId=' + userId;
        if (dates?.startDate) url += '&startDate=' + encodeURIComponent(dates.startDate);
        if (dates?.endDate) url += '&endDate=' + encodeURIComponent(dates.endDate);
        const { data } = await axios.get(url);
        console.log("Categorical Amounts:", data);
        return data;
    } catch (error) {
        console.error("Error rendering calculations:", error.response ? error.response.data : error.message);
        throw error;
    }
}

export const dailyForcastOfIncomeExpense = async () => {
    const userId = getUserID();
    try {
        const { data } = await axios.get('/Transaction/GetDailyTotals?userId=' + userId);
        console.log("Daily Income Expense Amounts:", data);
        return data;
    } catch (error) {
        console.error("Error rendering calculations:", error.response ? error.response.data : error.message);
        throw error;
    }
}

export const dateRangeBasedIncomeExpense = async (dates) => {
    const userId = getUserID();
    try {
        let url = '/Transaction/GetRangeTotals?userId=' + userId;
        if (dates?.startDate) url += '&startDate=' + encodeURIComponent(dates.startDate);
        if (dates?.endDate) url += '&endDate=' + encodeURIComponent(dates.endDate);
        const { data } = await axios.get(url);
        console.log("Range-based Income Expense Amounts:", data);
        return data;
    } catch (error) {
        console.error("Error rendering calculations:", error.response ? error.response.data : error.message);
        throw error;
    }
}
