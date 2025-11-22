
import React, { useEffect, useState, useReducer, useRef } from "react";
import { Tag, message } from "antd";
import ExpenseCard from "./common/ExpenseCard";
import { useNavigate } from "react-router-dom";
import { FaXmark, FaBars } from "react-icons/fa6";
import { getCategories, getTransactions } from "../Services/transactionService";
import { useAuth } from "../hooks/useAuth";
import { FiMinimize, FiMaximize } from "react-icons/fi";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

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
        transactionItems: state.transactionItems.filter(
          (item) => item.transactionId !== action.payload
        ),
      };
    default:
      return state;
  }
};

const TransactionPage = ({
  startingDate,
  endingDate,
  databaseUpdate,
  popupSelection,
  deletemodelSelection,
  onMaximizeToggle,
  maxStatus,
}) => {
  const navigate = useNavigate();
  const { userId } = useAuth();
  const [state, dispatch] = useReducer(reducer, initialState);
  const { transactionItems } = state;

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [incomeCategories, setIncomeCategories] = useState([]);
  const [expenseCategories, setExpenseCategories] = useState([]);
  const [selectedTag, setSelectedTag] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filteredItems, setFilteredItems] = useState([]);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [isDatabaseUpdated, setIsDatabaseUpdated] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  const leftElementRef = useRef(null);
  const rightElementRef = useRef(null);
  const tableRef = useRef(null);

  // ✅ Load Transactions & Categories
  useEffect(() => {
    if (!userId) return;

    const loadTransactions = async () => {
      try {
        const data = await getTransactions(userId, { startingDate, endingDate });
        if (Array.isArray(data)) {
          const sortedTransactions = data.sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          );
          dispatch({ type: "Transactions_Loaded", payload: sortedTransactions });
        } else {
          console.error("Invalid transactions data:", data);
          dispatch({ type: "Transactions_Loaded", payload: [] });
        }
      } catch (error) {
        console.error("Error loading transactions:", error);
        message.error("Failed to load transactions.");
      }
    };

    const loadCategories = async () => {
      try {
        const categoriesData = await getCategories(userId);
        setIncomeCategories(categoriesData?.income || []);
        setExpenseCategories(categoriesData?.expense || []);
      } catch (error) {
        console.error("Error loading categories:", error);
        message.error("Failed to load categories.");
      }
    };

    loadTransactions();
    loadCategories();
  }, [userId, startingDate, endingDate, isDatabaseUpdated, databaseUpdate]);

  // ✅ Filtering logic
  useEffect(() => {
    let items = transactionItems || [];

    if (selectedTag === "All") {
      setFilteredItems(items);
    } else {
      items = items.filter((item) => item.type === selectedTag);
      if (selectedCategory !== "All") {
        items = items.filter((item) => item.category === selectedCategory);
      }
      setFilteredItems(items);
    }
  }, [transactionItems, selectedTag, selectedCategory]);

  // ✅ Handlers
  const handleTagClick = (tag) => {
    setSelectedTag(tag);
    setSelectedCategory("All");
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    setShowCategoryDropdown(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleUpdateSelection = (selection) => {
    popupSelection(selection);
  };

  const handleDeleteTransaction = (transactionId) => {
    deletemodelSelection(transactionId);
  };

  const handleMaximizeToggle = (e) => {
    e.preventDefault();
    const status = onMaximizeToggle();
    setIsMaximized(status);
  };

  return (
    <div className="h-full md:mx-5 mx-2 my-2 rounded-lg backdrop-blur-lg">
      <div className="w-full h-full">
        {/* MOBILE MENU */}
        <div className="flex lg:hidden w-full items-center justify-start">
          <button
            className="text-black focus:outline-none m-2"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <FaXmark className="h-4 w-4" /> : <FaBars className="h-4 w-4" />}
          </button>
        </div>

        {/* SIDE MENU */}
        <div
          className={`absolute space-y-2 z-30 left-5 w-[200px] mb-2 rounded-l-lg transition-all duration-500 bg-primary shadow-lg border-[3px] border-golden ${
            isMenuOpen ? "block bg-white" : "hidden"
          }`}
        >
          <ul className="flex flex-col gap-1 p-2 text-[12px] font-semibold">
            {["All", "Income", "Expense"].map((tag) => (
              <li
                key={tag}
                onClick={() => handleTagClick(tag)}
                className="p-2 bg-white hover:bg-gray-200 rounded-md cursor-pointer"
              >
                {tag}
              </li>
            ))}
          </ul>
        </div>

        {/* DESKTOP TAGS + MAX BUTTON */}
        <div className="hidden lg:flex flex-row justify-center items-center mx-5 text-black font-semibold">
          <div className="flex justify-center w-full">
            {["All", "Income", "Expense"].map((tag) => (
              <Tag
                key={tag}
                className={`w-40 h-6 ${
                  selectedTag === tag ? "bg-[#4B71F0] text-white" : "bg-white"
                } hover:bg-[#D5D6EE] rounded-xl text-md text-center border cursor-pointer`}
                onClick={() => handleTagClick(tag)}
              >
                {tag}
              </Tag>
            ))}
          </div>

          <div className="flex items-center justify-end">
            <button
              className="text-xl font-extrabold m-4"
              onClick={handleMaximizeToggle}
            >
              {maxStatus ? (
                <FiMinimize className="text-white" />
              ) : (
                <FiMaximize className="text-black" />
              )}
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="backdrop-blur-md md:mx-5 mx-3 mb-5 bg-white/90 md:p-5 p-2 rounded-xl overflow-hidden">
          <div className="py-2">
            <table
              ref={tableRef}
              className={`table-auto w-full ${
                maxStatus ? "lg:h-[70vh]" : "lg:h-[60vh]"
              } rounded-2xl`}
            >
              <thead className="text-[0.9rem] text-white font-semibold bg-[#4B71F0] rounded-2xl">
                <tr className="flex w-full items-center rounded-lg">
                  <th className="w-[35%] pl-6 text-left">About Transaction</th>
                  <th className="w-[20%] relative text-left pl-3">
                    Category
                    <button
                      onClick={() =>
                        setShowCategoryDropdown(!showCategoryDropdown)
                      }
                      className="ml-2"
                    >
                      {selectedTag !== "All" &&
                        (showCategoryDropdown ? (
                          <FaChevronUp />
                        ) : (
                          <FaChevronDown />
                        ))}
                    </button>

                    {/* CATEGORY DROPDOWN */}
                    {showCategoryDropdown && (
                      <div className="absolute bg-white border rounded shadow-lg z-50">
                        <button
                          onClick={() => handleCategoryChange("All")}
                          className="block px-4 py-2 w-full text-start hover:bg-gray-200"
                        >
                          {selectedTag === "Income"
                            ? "All Incomes"
                            : "All Expenses"}
                        </button>
                        {(selectedTag === "Income"
                          ? incomeCategories
                          : expenseCategories
                        )?.map((category, index) => (
                          <button
                            key={index}
                            onClick={() => handleCategoryChange(category)}
                            className="block px-4 py-2 w-full text-start hover:bg-gray-200"
                          >
                            {category}
                          </button>
                        ))}
                      </div>
                    )}
                  </th>
                  <th className="w-[15%] text-left pl-3">Date</th>
                  <th className="w-[15%] text-left pl-3">Amount</th>
                  <th className="w-[15%]" />
                </tr>
              </thead>

              <tbody className="flex flex-col justify-start gap-1 pb-5 overflow-y-auto max-h-[60vh]">
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <ExpenseCard
                      key={item.transactionId}
                      selection={item}
                      onOpen={handleUpdateSelection}
                      deleteModelOpened={handleDeleteTransaction}
                    />
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center text-gray-600 py-5 italic"
                    >
                      No transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionPage;



