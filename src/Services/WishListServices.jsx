import axios from "axios";
axios.defaults.baseURL = "https://expensebackend.dockyardsoftware.com";

// Helper function to get UserID from localStorage
const getUserID = () => localStorage.getItem("UserID");


//  GET ALL WISHES

export const getAllWishes = async () => {
  const userId = getUserID();
  try {
    const { data } = await axios.get("/WishList/GetAllWishes?userId=" + userId);
    console.log("Fetched all wishes from the database:", data);
    return data;
  } catch (error) {
    console.error(
      "Error getting wishes:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};


//  ADD NEW WISH

export const addWish = async (newWishData) => {
  newWishData.UserID = getUserID(); // automatically add UserID
  console.log("Sending new wish to the backend:", newWishData);

  try {
    const { data } = await axios.post("/WishList/AddWish", newWishData);
    console.log("Wish added successfully:", data);
    return data;
  } catch (error) {
    console.error(
      "Error adding wish:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};


//  MARK WISH AS COMPLETED

export const markWishCompleted = async (wishData) => {
  wishData.UserID = getUserID(); // attach UserID
  console.log("Marking wish as completed:", wishData);

  try {
    const { data } = await axios.post("/WishList/MarkWishCompleted", wishData);
    console.log("Wish marked as completed:", data);
    return data;
  } catch (error) {
    console.error(
      "Error marking wish as completed:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};
