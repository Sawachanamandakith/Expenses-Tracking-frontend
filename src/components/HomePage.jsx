
import React, { useState, useRef, useEffect, useReducer } from "react";
import { useAuth } from "../hooks/useAuth";
import TransactionPage from "./transactionPage";
import Dashboard from "./dashboard";
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import TransactionForm from "./common/transactionForm";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import "./../index.css";
import { Flex, message } from "antd";
import { endOfYesterday, format, isYesterday } from "date-fns";
import { BorderColor } from "@mui/icons-material";
import { FaXmark } from "react-icons/fa6";
import { deleteTransaction } from "../Services/transactionService";
import { GiPayMoney } from "react-icons/gi";
import { GiReceiveMoney } from "react-icons/gi";

const initialState = { transactionItems: [] };
const reducer = (state, action) => {
  switch (action.type) {
    case "Transactions_Loaded":
      return { ...state, transactionItems: action.payload };
    case "Filter_Transactions":
      return { ...state, transactionItems: action.payload };
    case "Transaction_Deleted":
      return {
        ...state,
        transactionItems: state.transactionItems.filter(item => item.transactionId !== action.payload),
      };
    default:
      return state;
  }
};

const HomePage = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { transactionItems } = state;
  const { logout } = useAuth();
  const [startingDate, setStartingDate] = useState(null);
  const [endingDate, setEndingDate] = useState(null);
  const [selectedRange, setSelectedRange] = useState("anyTime");
  const transactionPageRef = useRef(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [databaseUpdate, setDatabaseUpdate] = useState(false);
  const { userId } = useAuth();
  const { userName } = useAuth();
  const [isPopupWindowOpened, setIsPopupWindowOpened] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingTransactionId, setDeletingTransactionId] = useState();
  const [isDatabaseUpdated, setIsDatabaseUpdated] = useState(false);
  const [popupType, setPopupType] = useState("");
  const [popupSelection, setPopupSelection] = useState();
  const [isMaximized, setIsMaximized] = useState(false);
  const [isCustomSelected, setIsCustomSelected] = useState(false);
  const [displayText, setDisplayText] = useState("");
  const [isChartVisible, setIsChartVisible] = useState(false);
  const text = "Select a Date Range & get more Information";

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayText((prev) => prev + text[index]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = async e => {
    e.preventDefault();
    await logout();
  };

  const handleScrollToTransactionPage = () => {
    if (transactionPageRef.current) {
      transactionPageRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const handleDatabaseUpdate = () => {
    setDatabaseUpdate(prev => !prev);
  };

  const handleIncomeCard = () => {
    setIsPopupWindowOpened(true);
    setPopupType("Income");
  };

  const handleExpenseCard = () => {
    setIsPopupWindowOpened(true);
    setPopupType("Expense");
  };

  const closePopupWindow = () => {
    setIsPopupWindowOpened(false);
    setPopupSelection(null);
  };

  const handleTransactionAddEdit = async () => {
    setIsDatabaseUpdated(true);
    handleDatabaseUpdate();
    message.success("Transaction updated successfully!");
  };

  const handlePopupSelection = (e) => {
    setPopupSelection(e);
    setIsPopupWindowOpened(true);
  };

  const handleDeleteModelSelection = (e) => {
    setDeletingTransactionId(e);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteTransaction(deletingTransactionId);
      dispatch({
        type: "Transaction_Deleted",
        payload: deletingTransactionId,
      });
      message.success("Successfully deleted the transaction!");
      handleDatabaseUpdate();
    } catch (error) {
      console.error("Error deleting transaction:", error);
      message.error("Deletion failed!");
    }
    setShowDeleteModal(false);
  };

  const handleMaximizeToggle = () => {
    setIsMaximized(!isMaximized);
  };

  const handleDateRange = (e) => {
    const selectedRange = e.target.value;
    setSelectedRange(selectedRange);
    setIsCustomSelected(false);

    let startingDate = null;
    let endingDate = null;
    const today = new Date();

    switch (selectedRange) {
      case "anyTime": {
        startingDate = null;
        endingDate = null;
        setIsChartVisible(false);
        break;
      }
      case "today": {
        startingDate = new Date();
        startingDate.setHours(0, 0, 0, 0);
        endingDate = new Date();
        endingDate.setHours(23, 59, 59, 999);
        setIsChartVisible(true);
        break;
      }
      case "yesterday": {
        startingDate = new Date(today);
        startingDate.setDate(today.getDate() - 1);
        startingDate.setHours(0, 0, 0, 0);
        endingDate = new Date(startingDate);
        endingDate.setHours(23, 59, 59, 999);
        setIsChartVisible(true);
        break;
      }
      case "lastWeek": {
        const firstDayOfWeek = today.getDay();
        startingDate = new Date(today);
        startingDate.setDate(today.getDate() - firstDayOfWeek - 7);
        startingDate.setHours(0, 0, 0, 0);
        endingDate = new Date(startingDate);
        endingDate.setDate(startingDate.getDate() + 6);
        endingDate.setHours(23, 59, 59, 999);
        setIsChartVisible(true);
        break;
      }
      case "lastMonth": {
        startingDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        endingDate = new Date(today.getFullYear(), today.getMonth(), 0);
        endingDate.setHours(23, 59, 59, 999);
        setIsChartVisible(true);
        break;
      }
      case "lastSixMonths": {
        startingDate = new Date(today);
        startingDate.setMonth(today.getMonth() - 6);
        startingDate.setHours(0, 0, 0, 0);
        endingDate = new Date(today);
        endingDate.setHours(23, 59, 59, 999);
        setIsChartVisible(true);
        break;
      }
      case "lastYear": {
        startingDate = new Date(today.getFullYear() - 1, 0, 1);
        startingDate.setHours(0, 0, 0, 0);
        endingDate = new Date(today.getFullYear() - 1, 11, 31);
        endingDate.setHours(23, 59, 59, 999);
        setIsChartVisible(true);
        break;
      }
      case "custom": {
        setIsCustomSelected(true);
        setIsChartVisible(true);
        break;
      }
      default: {
        console.error("Invalid range type provided!");
        return;
      }
    }

    setStartingDate(startingDate);
    setEndingDate(endingDate);
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="flex flex-col lg:flex-row lg:h-full w-full">
        {/* Sidebar */}
        <div className="lg:fixed lg:left-0 lg:top-0 lg:h-full lg:pb-10 lg:w-1/5 bg-gradient-to-b from-white to-blue-50/50 flex flex-col items-center py-8 shadow-2xl border-r border-blue-100/50">

          {/* Logo Section */}
          <div className="justify-start items-start flex flex-col px-6 py-2 w-full">
            <img 
              src="/logoNew3.png" 
              alt="logoNew3" 
              className="w-64 h-auto rounded-2xl shadow-2xl transition-all duration-500 hover:scale-105 hover:shadow-3xl"
              style={{
                filter: 'drop-shadow(0 8px 24px rgba(79, 70, 229, 0.3))'
              }}
            />
          </div>

          {/* Mobile Date Range Selection */}
          <div className="flex flex-col items-center mt-4 px-6 w-full lg:hidden">
            <div className="relative rounded-2xl bg-white/80 backdrop-blur-sm gap-2 p-4 w-full shadow-lg border border-blue-200/50">
              <p className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">Select Date Range</p>
              {!isCustomSelected ? (
                <div className="w-full">
                  <select
                    value={selectedRange}
                    onChange={handleDateRange}
                    className="w-full bg-white/90 border-2 border-blue-200 rounded-xl text-gray-700 text-base py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 shadow-sm transition-all duration-300"
                  >
                    <option value="anyTime">📅 Any time</option>
                    <option value="today">🌞 Today</option>
                    <option value="yesterday">📆 Yesterday</option>
                    <option value="lastWeek">📊 Last week</option>
                    <option value="lastMonth">🗓️ Last month</option>
                    <option value="lastSixMonths">📈 Last six months</option>
                    <option value="lastYear">🎯 Last year</option>
                    <option value="custom">⚙️ Custom</option>
                  </select>
                </div>
              ) : (
                <div className="fixed top-0 left-0 right-0 bottom-0 z-50 flex items-center justify-center p-5 bg-black/70 backdrop-blur-sm">
                  <div className="flex flex-col items-center gap-3 justify-center p-6 border-2 border-blue-300 rounded-3xl bg-white shadow-2xl max-w-md w-full">
                    <button className="flex items-end justify-end w-full px-3 py-2 text-gray-500 hover:text-gray-700 text-md transition-colors" onClick={() => setIsCustomSelected(false)}>
                      <FaXmark size={24} />
                    </button>
                    <div className="w-full items-center justify-center flex">
                      <p className="text-blue-600 text-xl font-bold mb-3 bg-blue-50 px-4 py-2 rounded-full">
                        {startingDate ? format(startingDate, "yyyy MMM dd") : "Start Date"} - {endingDate ? format(endingDate, "yyyy MMM dd") : "End Date"}
                      </p>
                    </div>
                    <DatePicker
                      selected={startingDate}
                      onChange={(update) => {
                        const [start, end] = update;
                        setStartingDate(start);
                        setEndingDate(end);
                      }}
                      startDate={startingDate}
                      endDate={endingDate}
                      selectsRange
                      inline
                      placeholderText="Select a date range"
                      className="custom-calendar rounded-2xl border-2 border-blue-200 p-4"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:hidden pt-4 w-full flex">
            <Dashboard
              startingDate={startingDate}
              endingDate={endingDate}
              databaseUpdate={databaseUpdate}
              isCustomChart={isChartVisible}
              selectedRange={selectedRange}
            />
          </div>

          {/* Income and Expense Buttons */}
                    <div className="lg:flex hidden flex-col items-center justify-center w-full mt-10 space-y-3 px-5">
            <button
              onClick={handleIncomeCard}
              className="flex flex-row justify-center items-center gap-4 w-full h-20 
                          bg-gradient-to-r from-green-400 via-green-500 to-green-600 
                          text-2xl text-center text-white rounded-lg shadow-md 
                          hover:from-green-500 hover:via-green-600 hover:to-green-700 
                          transition"
            >
              <GiReceiveMoney /> Income
            </button>
            <button
              onClick={handleExpenseCard}
              className="flex flex-row justify-center items-center gap-4 w-full h-20 
                                bg-gradient-to-r from-red-500 via-red-600 to-red-700 
                                text-2xl text-center text-white rounded-lg shadow-md 
                                hover:from-red-600 hover:via-red-700 hover:to-red-800 
                                transition"
            >
              <GiPayMoney /> Expense
            </button>
          </div>
          {/* Desktop Date Picker Section */}
          <div className="hidden lg:flex flex-col items-center mt-3 px-4 w-full">
            <div className="relative rounded-2xl bg-white/90 backdrop-blur-sm p-5 w-full border-2 border-blue-200/70 shadow-xl">
              <p className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent px-2 pb-3">📅 Select Date Range</p>
              {!isCustomSelected ? (
                <div className="flex flex-col gap-3 w-full justify-center">
                  {["anyTime", "today", "yesterday", "lastWeek", "lastMonth", "lastSixMonths", "lastYear", "custom"].map((range, index) => (
                    <div key={range} className="flex gap-3 items-center group cursor-pointer">
                      <input
                        type="radio"
                        id={`range${index + 1}`}
                        value={range}
                        checked={selectedRange === range}
                        onChange={handleDateRange}
                        className="peer text-sm font-semibold cursor-pointer appearance-none w-5 h-5 border-2 border-blue-200 hover:border-blue-400 rounded-full checked:bg-gradient-to-r checked:from-blue-500 checked:to-purple-500 checked:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300"
                      />
                      <label
                        htmlFor={`range${index + 1}`}
                        className="text-gray-600 peer-checked:text-blue-600 peer-checked:font-bold group-hover:text-blue-500 capitalize text-sm font-medium transition-all duration-300"
                      >
                        {range === "anyTime" ? "📅 Any time" :
                         range === "today" ? "🌞 Today" :
                         range === "yesterday" ? "📆 Yesterday" :
                         range === "lastWeek" ? "📊 Last week" :
                         range === "lastMonth" ? "🗓️ Last month" :
                         range === "lastSixMonths" ? "📈 Last six months" :
                         range === "lastYear" ? "🎯 Last year" :
                         "⚙️ Custom"}
                      </label>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="relative flex flex-col justify-center items-center">
                  <div className="w-full items-center justify-center flex mb-4">
                    <p className="text-blue-600 text-xl font-bold bg-blue-50 px-4 py-2 rounded-full shadow-sm">
                      {startingDate ? format(startingDate, "yyyy MMM dd") : "Start Date"} - {endingDate ? format(endingDate, "yyyy MMM dd") : "End Date"}
                    </p>
                  </div>
                  <DatePicker
                    selected={startingDate}
                    onChange={(update) => {
                      const [start, end] = update;
                      setStartingDate(start);
                      setEndingDate(end);
                    }}
                    startDate={startingDate}
                    endDate={endingDate}
                    selectsRange
                    inline
                    placeholderText="Select a date range"
                    className="custom-calendar rounded-2xl border-2 border-blue-200 p-4 shadow-lg"
                  />
                  <button className="flex items-end justify-end w-full px-3 text-blue-500 hover:text-blue-700 text-sm font-semibold underline mt-4 transition-colors" onClick={() => setIsCustomSelected(false)}>
                    Close Calendar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:ml-[20%] flex-1 py-6 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-indigo-50/30">
          {/* Dashboard */}
          <div className="hidden lg:block pb-6 px-6">
            <Dashboard
              startingDate={startingDate}
              endingDate={endingDate}
              databaseUpdate={databaseUpdate}
              isCustomChart={isChartVisible}
              selectedRange={selectedRange}
            />
          </div>

          {/* Mobile Income and Expense Buttons */}
          <div className="flex lg:hidden flex-col items-center justify-center w-full mt-8 space-y-4 px-6 pb-6">
            <button
              onClick={handleIncomeCard}
              className="flex justify-center items-center gap-4 w-full h-24 
                          bg-gradient-to-r from-emerald-400 to-emerald-600 
                          text-2xl text-center text-white rounded-2xl shadow-2xl 
                          hover:from-emerald-500 hover:to-emerald-700 
                          hover:shadow-3xl hover:scale-105 transform transition-all duration-300
                          border-2 border-emerald-300/30"
            >
              <GiReceiveMoney className="text-3xl" /> Income
            </button>
            <button
              onClick={handleExpenseCard}
              className="flex justify-center items-center gap-4 w-full h-24 
                          bg-gradient-to-r from-rose-500 to-rose-700 
                          text-2xl text-center text-white rounded-2xl shadow-2xl 
                          hover:from-rose-600 hover:to-rose-800 
                          hover:shadow-3xl hover:scale-105 transform transition-all duration-300
                          border-2 border-rose-300/30"
            >
              <GiPayMoney className="text-3xl" /> Expense
            </button>
          </div>

          {/* Popup Transaction Form */}
          {isPopupWindowOpened && (
            <div className="fixed inset-0 flex justify-center items-center bg-black/80 backdrop-blur-sm z-50">
              <TransactionForm
                type={popupType}
                Selection={popupSelection}
                onClose={closePopupWindow}
                onAddEdit={handleTransactionAddEdit}
              />
            </div>
          )}

          {/* Maximized Transaction Page */}
          {isMaximized && (
            <div className="fixed inset-0 flex justify-center items-center bg-black/80 backdrop-blur-sm z-40">
              <div className="w-11/12 h-[90%] bg-white rounded-2xl shadow-3xl border-2 border-blue-200/50 overflow-hidden">
                <TransactionPage
                  startingDate={startingDate}
                  endingDate={endingDate}
                  databaseUpdate={databaseUpdate}
                  popupSelection={handlePopupSelection}
                  deletemodelSelection={handleDeleteModelSelection}
                  onMaximizeToggle={handleMaximizeToggle}
                  maxStatus={isMaximized}
                />
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {showDeleteModal && (
            <div className="fixed inset-0 flex justify-center items-center p-5 z-50 bg-black/80 backdrop-blur-sm">
              <div className="bg-white rounded-2xl shadow-2xl lg:p-8 p-6 border-2 border-red-200/50 max-w-md w-full">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FaXmark className="text-red-500 text-2xl" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Confirm Deletion</h3>
                </div>
                <p className="text-gray-600 text-center mb-6">Are you sure you want to delete this transaction? This action cannot be undone.</p>
                <div className="flex justify-center space-x-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Confirm Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;




// import React, { useState, useRef, useEffect, useReducer } from "react";
// import { useAuth } from "../hooks/useAuth";
// import TransactionPage from "./transactionPage";
// import Dashboard from "./dashboard";
// import Button from '@mui/material/Button';
// import Menu from '@mui/material/Menu';
// import MenuItem from '@mui/material/MenuItem';
// import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
// import TransactionForm from "./common/transactionForm";
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import "./../index.css";
// import { Flex, message } from "antd";
// import { endOfYesterday, format, isYesterday } from "date-fns";
// import { BorderColor } from "@mui/icons-material";
// import { FaXmark } from "react-icons/fa6";
// import { deleteTransaction } from "../Services/transactionService";
// import { GiPayMoney } from "react-icons/gi";
// import { GiReceiveMoney } from "react-icons/gi";

// const initialState = { transactionItems: [] };
// const reducer = (state, action) => {
//   switch (action.type) {
//     case "Transactions_Loaded":
//       return { ...state, transactionItems: action.payload };
//     case "Filter_Transactions":
//       return { ...state, transactionItems: action.payload };
//     case "Transaction_Deleted":
//       return {
//         ...state,
//         transactionItems: state.transactionItems.filter(item => item.transactionId !== action.payload),
//       };
//     default:
//       return state;
//   }
// };

// const HomePage = () => {
//   const [state, dispatch] = useReducer(reducer, initialState);
//   const { transactionItems } = state;
//   const { logout } = useAuth();
//   const [startingDate, setStartingDate] = useState(null);
//   const [endingDate, setEndingDate] = useState(null);
//   const [selectedRange, setSelectedRange] = useState("anyTime");
//   const transactionPageRef = useRef(null);
//   const [refreshKey, setRefreshKey] = useState(0);
//   const [databaseUpdate, setDatabaseUpdate] = useState(false);
//   const { userId } = useAuth();
//   const { userName } = useAuth();
//   const [isPopupWindowOpened, setIsPopupWindowOpened] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [deletingTransactionId, setDeletingTransactionId] = useState();
//   const [isDatabaseUpdated, setIsDatabaseUpdated] = useState(false);
//   const [popupType, setPopupType] = useState("");
//   const [popupSelection, setPopupSelection] = useState();
//   const [isMaximized, setIsMaximized] = useState(false);
//   const [isCustomSelected, setIsCustomSelected] = useState(false);
//   const [displayText, setDisplayText] = useState("");
//   const [isChartVisible, setIsChartVisible] = useState(false);
//   const text = "Select a Date Range & get more Information";

//   useEffect(() => {
//     let index = 0;
//     const interval = setInterval(() => {
//       if (index < text.length) {
//         setDisplayText((prev) => prev + text[index]);
//         index++;
//       } else {
//         clearInterval(interval);
//       }
//     }, 50);

//     return () => clearInterval(interval);
//   }, []);

//   const handleLogout = async e => {
//     e.preventDefault();
//     await logout();
//   };

//   const handleScrollToTransactionPage = () => {
//     if (transactionPageRef.current) {
//       transactionPageRef.current.scrollIntoView({
//         behavior: 'smooth',
//         block: 'start'
//       });
//     }
//   };

//   const handleDatabaseUpdate = () => {
//     setDatabaseUpdate(prev => !prev);
//   };

//   const handleIncomeCard = () => {
//     setIsPopupWindowOpened(true);
//     setPopupType("Income");
//   };

//   const handleExpenseCard = () => {
//     setIsPopupWindowOpened(true);
//     setPopupType("Expense");
//   };

//   const closePopupWindow = () => {
//     setIsPopupWindowOpened(false);
//     setPopupSelection(null);
//   };

//   const handleTransactionAddEdit = async () => {
//     setIsDatabaseUpdated(true);
//     handleDatabaseUpdate();
//     message.success("Transaction updated successfully!");
//   };

//   const handlePopupSelection = (e) => {
//     setPopupSelection(e);
//     setIsPopupWindowOpened(true);
//   };

//   const handleDeleteModelSelection = (e) => {
//     setDeletingTransactionId(e);
//     setShowDeleteModal(true);
//   };

//   const confirmDelete = async () => {
//     try {
//       await deleteTransaction(deletingTransactionId);
//       dispatch({
//         type: "Transaction_Deleted",
//         payload: deletingTransactionId,
//       });
//       message.success("Successfully deleted the transaction!");
//       handleDatabaseUpdate();
//     } catch (error) {
//       console.error("Error deleting transaction:", error);
//       message.error("Deletion failed!");
//     }
//     setShowDeleteModal(false);
//   };

//   const handleMaximizeToggle = () => {
//     setIsMaximized(!isMaximized);
//   };

//   const handleDateRange = (e) => {
//     const selectedRange = e.target.value;
//     setSelectedRange(selectedRange);
//     setIsCustomSelected(false);

//     let startingDate = null;
//     let endingDate = null;
//     const today = new Date();

//     switch (selectedRange) {
//       case "anyTime": {
//         startingDate = null;
//         endingDate = null;
//         setIsChartVisible(false);
//         break;
//       }
//       case "today": {
//         startingDate = new Date();
//         startingDate.setHours(0, 0, 0, 0);
//         endingDate = new Date();
//         endingDate.setHours(23, 59, 59, 999);
//         setIsChartVisible(true);
//         break;
//       }
//       case "yesterday": {
//         startingDate = new Date(today);
//         startingDate.setDate(today.getDate() - 1);
//         startingDate.setHours(0, 0, 0, 0);
//         endingDate = new Date(startingDate);
//         endingDate.setHours(23, 59, 59, 999);
//         setIsChartVisible(true);
//         break;
//       }
//       case "lastWeek": {
//         const firstDayOfWeek = today.getDay();
//         startingDate = new Date(today);
//         startingDate.setDate(today.getDate() - firstDayOfWeek - 7);
//         startingDate.setHours(0, 0, 0, 0);
//         endingDate = new Date(startingDate);
//         endingDate.setDate(startingDate.getDate() + 6);
//         endingDate.setHours(23, 59, 59, 999);
//         setIsChartVisible(true);
//         break;
//       }
//       case "lastMonth": {
//         startingDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
//         endingDate = new Date(today.getFullYear(), today.getMonth(), 0);
//         endingDate.setHours(23, 59, 59, 999);
//         setIsChartVisible(true);
//         break;
//       }
//       case "lastSixMonths": {
//         startingDate = new Date(today);
//         startingDate.setMonth(today.getMonth() - 6);
//         startingDate.setHours(0, 0, 0, 0);
//         endingDate = new Date(today);
//         endingDate.setHours(23, 59, 59, 999);
//         setIsChartVisible(true);
//         break;
//       }
//       case "lastYear": {
//         startingDate = new Date(today.getFullYear() - 1, 0, 1);
//         startingDate.setHours(0, 0, 0, 0);
//         endingDate = new Date(today.getFullYear() - 1, 11, 31);
//         endingDate.setHours(23, 59, 59, 999);
//         setIsChartVisible(true);
//         break;
//       }
//       case "custom": {
//         setIsCustomSelected(true);
//         setIsChartVisible(true);
//         break;
//       }
//       default: {
//         console.error("Invalid range type provided!");
//         return;
//       }
//     }

//     setStartingDate(startingDate);
//     setEndingDate(endingDate);
//   };

//   return (
//     <div className="bg-back min-h-screen w-full bg-cover">
//       <div className="flex flex-col lg:flex-row lg:h-full w-full">
//         {/* Sidebar */}
//         <div className="lg:fixed lg:left-0 lg:top-0 lg:h-full lg:pb-10 lg:w-1/5 bg-[#F6F8FE] lg:bg-white flex flex-col items-center py-5">

//           <div className="justify-start items-start flex flex-col px-5 py-1 w-full">
//             <img 
//               src="/logoNew3.png" 
//               alt="logoNew3" 
//               style={{
//                 width: '255px',           
//                 height: 'auto',          
//                 borderRadius: '12px',    
//                 boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)', 
//                 transition: 'transform 0.3s ease',
//               }}
//               onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
//               onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
//             />
//             </div>

//           {/* Mobile Date Range Selection */}
//           <div className="flex flex-col items-center mt-2 px-5 w-full lg:hidden">
//             <div className="relative rounded-3xl bg-transparent gap-1 px-5 w-full">
//               <p className="text-md font-semibold text-white">Select range</p>
//               {!isCustomSelected ? (
//                 <div className="w-full">
//                   <select
//                     value={selectedRange}
//                     onChange={handleDateRange}
//                     className="w-full bg-transparent border border-gray-300 rounded-lg text-black text-sm py-2 px-4 focus:outline-none focus:ring-2 focus:ring-green-500">
//                     <option value="anyTime">Any time</option>
//                     <option value="today">Today</option>
//                     <option value="yesterday">Yesterday</option>
//                     <option value="lastWeek">Last week</option>
//                     <option value="lastMonth">Last month</option>
//                     <option value="lastSixMonths">Last six months</option>
//                     <option value="lastYear">Last year</option>
//                     <option value="custom">Custom</option>
//                   </select>
//                 </div>
//               ) : (
//                 <div className="fixed top-0 left-0 right-0 bottom-0 z-50 flex items-center justify-center p-5 bg-black bg-opacity-50">
//                   <div className="flex flex-col items-center gap-1 justify-center p-5 border border-[#4B71F0] rounded-3xl bg-white max-w-md w-full">
//                     <button className="flex items-end justify-end w-full px-3 py-2 text-black text-md" onClick={() => setIsCustomSelected(false)}>
//                       <FaXmark size={20} />
//                     </button>
//                     <div className="w-full items-center justify-center flex">
//                       <p className="text-[#BAB9E0] text-lg font-semibold mb-2">
//                         {startingDate ? format(startingDate, "yyyy MMM dd") : "Start Date"} - {endingDate ? format(endingDate, "yyyy MMM dd") : "End Date"}
//                       </p>
//                     </div>
//                     <DatePicker
//                       selected={startingDate}
//                       onChange={(update) => {
//                         const [start, end] = update;
//                         setStartingDate(start);
//                         setEndingDate(end);
//                       }}
//                       startDate={startingDate}
//                       endDate={endingDate}
//                       selectsRange
//                       inline
//                       placeholderText="Select a date range"
//                       className="custom-calendar"
//                     />
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>

//           <div className="lg:hidden pt-2 w-full flex">
//             <Dashboard
//               startingDate={startingDate}
//               endingDate={endingDate}
//               databaseUpdate={databaseUpdate}
//               isCustomChart={isChartVisible}
//               selectedRange={selectedRange}
//             />
//           </div>

//           {/* Income and Expense Buttons */}
//           <div className="lg:flex hidden flex-col items-center justify-center w-full mt-10 space-y-3 px-5">
//             <button
//               onClick={handleIncomeCard}
//               className="flex flex-row justify-center items-center gap-4 w-full h-20 
//                           bg-gradient-to-r from-green-400 via-green-500 to-green-600 
//                           text-2xl text-center text-white rounded-lg shadow-md 
//                           hover:from-green-500 hover:via-green-600 hover:to-green-700 
//                           transition"
//             >
//               <GiReceiveMoney /> Income
//             </button>
//             <button
//               onClick={handleExpenseCard}
//               className="flex flex-row justify-center items-center gap-4 w-full h-20 
//                                 bg-gradient-to-r from-red-500 via-red-600 to-red-700 
//                                 text-2xl text-center text-white rounded-lg shadow-md 
//                                 hover:from-red-600 hover:via-red-700 hover:to-red-800 
//                                 transition"
//             >
//               <GiPayMoney /> Expense
//             </button>
//           </div>

//           {/* Desktop Date Picker Section */}
//           <div className="hidden lg:flex flex-col items-center mt-5 px-5 w-full">
//             <div className="relative rounded-3xl bg-transparent p-3 w-full border border-[#4B71F0]">
//               <p className="text-md font-semibold text-[#4B71F0] px-2 pb-2">Select range</p>
//               {!isCustomSelected ? (
//                 <div className="flex flex-col gap-3 w-full justify-center pl-5">
//                   {["anyTime", "today", "yesterday", "lastWeek", "lastMonth", "lastSixMonths", "lastYear", "custom"].map((range, index) => (
//                     <div key={range} className="flex gap-2 items-center">
//                       <input
//                         type="radio"
//                         id={`range${index + 1}`}
//                         value={range}
//                         checked={selectedRange === range}
//                         onChange={handleDateRange}
//                         className="peer text-sm font-semibold cursor-pointer appearance-none w-4 h-4 border border-[#D5D6EE] hover:border-[#4B71F0] rounded-full checked:bg-[#D5D6EE] checked:border-[#4B71F0] focus:outline-none focus:ring-2 focus:ring-[#4B71F0]"
//                       />
//                       <label
//                         htmlFor={`range${index + 1}`}
//                         className="text-[#BAB9E0] peer-checked:text-[#4B71F0] focus:text-[#4B71F0] capitalize"
//                       >
//                         {range === "anyTime" ? "Any time" :
//                          range === "lastSixMonths" ? "Last six months" :
//                          range === "lastYear" ? "Last year" : range.replace(/([A-Z])/g, ' $1').trim()}
//                       </label>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="relative flex flex-col justify-center items-center">
//                   <div className="w-full items-center justify-center flex">
//                     <p className="text-[#BAB9E0] text-lg font-semibold mb-2">
//                       {startingDate ? format(startingDate, "yyyy MMM dd") : "Start Date"} - {endingDate ? format(endingDate, "yyyy MMM dd") : "End Date"}
//                     </p>
//                   </div>
//                   <DatePicker
//                     selected={startingDate}
//                     onChange={(update) => {
//                       const [start, end] = update;
//                       setStartingDate(start);
//                       setEndingDate(end);
//                     }}
//                     startDate={startingDate}
//                     endDate={endingDate}
//                     selectsRange
//                     inline
//                     placeholderText="Select a date range"
//                     className="custom-calendar"
//                   />
//                   <button className="flex items-end justify-end w-full px-3 text-[#BAB9E0] text-sm underline mt-2" onClick={() => setIsCustomSelected(false)}>
//                     Close
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Main Content */}
//         <div className="lg:ml-[20%] flex-1 py-5 bg-[#F6F8FE]">
//           {/* Dashboard */}
//           <div className="hidden lg:block pb-5">
//             <Dashboard
//               startingDate={startingDate}
//               endingDate={endingDate}
//               databaseUpdate={databaseUpdate}
//               isCustomChart={isChartVisible}
//               selectedRange={selectedRange}
//             />
//           </div>

//           {/* Mobile Income and Expense Buttons */}
//           <div className="flex lg:hidden flex-col items-center justify-center w-full mt-10 space-y-3 px-5 pb-5">
//             <button
//               onClick={handleIncomeCard}
//               className="flex justify-center items-center gap-4 w-full h-20 bg-[#00d0c2] text-2xl text-center text-white rounded-lg shadow-md hover:bg-[#14bbb0] transition"
//             >
//               <GiReceiveMoney /> Income
//             </button>
//             <button
//               onClick={handleExpenseCard}
//               className="flex justify-center items-center gap-4 w-full h-20 bg-[#EF854B] text-2xl text-center text-white rounded-lg shadow-md hover:bg-[#ee712e] transition"
//             >
//               <GiPayMoney /> Expense
//             </button>
//           </div>


//           {/* Popup Transaction Form */}
//           {isPopupWindowOpened && (
//             <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-80 z-50">
//               <TransactionForm
//                 type={popupType}
//                 Selection={popupSelection}
//                 onClose={closePopupWindow}
//                 onAddEdit={handleTransactionAddEdit}
//               />
//             </div>
//           )}

//           {/* Maximized Transaction Page */}
//           {isMaximized && (
//             <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-80 z-40">
//               <div className="w-11/12 h-[90%] bg-white rounded-lg">
//                 <TransactionPage
//                   startingDate={startingDate}
//                   endingDate={endingDate}
//                   databaseUpdate={databaseUpdate}
//                   popupSelection={handlePopupSelection}
//                   deletemodelSelection={handleDeleteModelSelection}
//                   onMaximizeToggle={handleMaximizeToggle}
//                   maxStatus={isMaximized}
//                 />
//               </div>
//             </div>
//           )}

//           {/* Delete Confirmation Modal */}
//           {showDeleteModal && (
//             <div className="fixed inset-0 flex justify-center items-center p-5 z-50 bg-black bg-opacity-80">
//               <div className="bg-white rounded-xl shadow-lg lg:p-8 p-5">
//                 <h3 className="text-lg font-bold mb-4 text-[black]">Confirm Deletion</h3>
//                 <p className="text-[black] text-sm mb-4">Are you sure you want to delete this transaction?</p>
//                 <div className="flex justify-end mt-4 space-x-2">
//                   <button
//                     onClick={() => setShowDeleteModal(false)}
//                     className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={confirmDelete}
//                     className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
//                   >
//                     Confirm
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HomePage; 


