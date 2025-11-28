
import React, { useEffect, useState } from "react";
import { Button, message } from "antd";
import { getTransactions, getInactiveTransactions } from "../Services/transactionService";
import TransactionForm from "./common/transactionForm";
import { useAuth } from "../hooks/useAuth";
import "jspdf-autotable";
import PdfPreview from "./PdfPreview"; // Add this import 
import { generateTransactionPDF } from "../utils/pdfGenerator"; // Add this import 
import { Link } from 'react-router-dom';
import { MdLogout, MdEdit, MdPictureAsPdf } from "react-icons/md"; // Add PDF icon 
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";


const COLORS = ["#4CAF50", "#F44336", "#2196F3"]; // Income, Expense, Balance

const Dashboard = ({ startingDate, endingDate, databaseUpdate, isCustomChart, selectedRange }) => {
  const { logout } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [filterType, setFilterType] = useState("All");
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [showInactive, setShowInactive] = useState(false); // ✅ new toggle state

  const [showPdfPreview, setShowPdfPreview] = useState(false); // Add this state 
  const [pdfData, setPdfData] = useState(null); // Add this state 


  // ------------------ Get Username from LocalStorage ------------------
  useEffect(() => {
    const storedUserName = localStorage.getItem("UserName");
    setUserName(storedUserName || "Guest");
  }, []);

  // ------------------ Load Transactions ------------------
  const loadTransactions = async () => {
    try {
      setLoading(true);

      const data = showInactive ? await getInactiveTransactions() : await getTransactions(); // ✅ switch between APIs

      let transactionsArray = [];
      if (Array.isArray(data)) {
        transactionsArray = data;
      } else if (data && Array.isArray(data.ResultSet)) {
        transactionsArray = data.ResultSet;
      } else if (data && data.ResultSet) {
        transactionsArray = Array.isArray(data.ResultSet)
          ? data.ResultSet
          : [data.ResultSet];
      }

      const normalizedTransactions = transactionsArray.map((t) => {
        let amount = parseFloat((t.Amount || t.amount || "0").toString().replace(",", ".")) || 0;
        return {
          id: t.TransactionID || t.id,
          userId: t.UserID || t.userId,
          type:
            (t.Type || t.type || "")
              .charAt(0)
              .toUpperCase() + (t.Type || t.type || "").slice(1).toLowerCase(),
          name: t.Name || t.name,
          date: t.Date || t.date,
          amount,
          category: t.Category || t.category,
          note: t.Note || t.note || "",
          status: t.Status || t.status || (showInactive ? "Inactive" : "Active"), // ✅ set status dynamically
        };
      });

      setTransactions(normalizedTransactions);
      setFilteredTransactions(normalizedTransactions);
    } catch (error) {
      console.error("Error loading transactions:", error);
      message.error("Failed to load transactions!");
    } finally {
      setLoading(false);
    }
  };

  // Initial Load + Re-Load on Toggle
  useEffect(() => {
    loadTransactions();
  }, [showInactive]);

  useEffect(() => {
    if (databaseUpdate) loadTransactions();
  }, [databaseUpdate]);

  // ------------------ Filter (Type + Date) ------------------
  useEffect(() => {
    let filtered = [...transactions];
    if (filterType !== "All") {
      filtered = filtered.filter(
        (t) => t.type && t.type.toLowerCase() === filterType.toLowerCase()
      );
    }
    if (startingDate && endingDate) {
      filtered = filtered.filter((t) => {
        const tDate = new Date(t.date);
        return tDate >= new Date(startingDate) && tDate <= new Date(endingDate);
      });
    }
    setFilteredTransactions(filtered);
  }, [filterType, transactions, startingDate, endingDate]);

  // ------------------ Totals ------------------
  const totalIncome = filteredTransactions
    .filter((t) => t.type?.toLowerCase() === "income")
    .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);

  const totalExpense = filteredTransactions
    .filter((t) => t.type?.toLowerCase() === "expense")
    .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);

  const balance = totalIncome - totalExpense;
  const total = totalIncome + totalExpense;
  const incomePercent = total ? ((totalIncome / total) * 100).toFixed(1) : 0;
  const expensePercent = total ? ((totalExpense / total) * 100).toFixed(1) : 0;
  const balancePercent = total ? ((balance / total) * 100).toFixed(1) : 0;

  const chartData = [
    { name: "Income", value: totalIncome },
    { name: "Expense", value: totalExpense },
    { name: "Balance", value: balance },
  ];

  // ------------------ Handlers ------------------
  const handleAddTransaction = () => {
    setSelectedTransaction(null);
    setShowForm(true);
  };

  const handleEditTransaction = (t) => {
    localStorage.setItem("TransactionID", t.id || t.TransactionID);
    setSelectedTransaction(t);
    setShowForm(true);
  };

  const handleCloseForm = () => setShowForm(false);
  const handleAddEditComplete = () => {
    loadTransactions();
    setShowForm(false);
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    await logout();
  };

  const handleToggleInactive = () => {
    setShowInactive((prev) => !prev); // ✅ toggle state
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);


const [searchTerm, setSearchTerm] = useState('');

useEffect(() => {
  let filtered = [...transactions];

  // Filter by type
  if (filterType !== "All") {
    filtered = filtered.filter(
      (t) => t.type && t.type.toLowerCase() === filterType.toLowerCase()
    );
  }

  // Filter by date range
  if (startingDate && endingDate) {
    filtered = filtered.filter((t) => {
      const tDate = new Date(t.date);
      return tDate >= new Date(startingDate) && tDate <= new Date(endingDate);
    });
  }

  // ✅ Filter by search term
  if (searchTerm.trim() !== "") {
    const term = searchTerm.toLowerCase();
    filtered = filtered.filter(
      (t) =>
        t.name?.toLowerCase().includes(term) ||
        t.category?.toLowerCase().includes(term) ||
        t.note?.toLowerCase().includes(term) ||
        t.type?.toLowerCase().includes(term) ||
        t.status?.toLowerCase().includes(term)
    );
  }

  setFilteredTransactions(filtered);
}, [filterType, transactions, startingDate, endingDate, searchTerm]); // ✅ add searchTerm dependency

// Add PDF Handler Functions 
  const handleGeneratePDF = () => {
    if (filteredTransactions.length === 0) {
      message.warning('No transactions to generate PDF');
      return;
    }

    const filters = {
      dateRange: startingDate && endingDate 
        ? `${startingDate} to ${endingDate}` 
        : 'All dates',
      type: filterType,
      searchTerm: searchTerm || 'None'
    };

    const totals = {
      income: totalIncome,
      expense: totalExpense,
      balance: balance
    };

    setPdfData({
      transactions: filteredTransactions,
      filters,
      totals,
      userName
    });
    setShowPdfPreview(true);
  };

  const handleDownloadPDF = () => {
    if (!pdfData) return;

    try {
      const doc = generateTransactionPDF(
        pdfData.transactions,
        pdfData.filters,
        pdfData.totals,
        pdfData.userName
      );
      
      const fileName = `Transaction_Report_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
      message.success('PDF downloaded successfully!');
      setShowPdfPreview(false);
    } catch (error) {
      console.error('Error generating PDF:', error);
      message.error('Failed to generate PDF');
    }
  };

  const handleClosePdfPreview = () => {
    setShowPdfPreview(false);
    setPdfData(null);
  };

return (
  <div className="p-5 w-full">
    {/* Header */}
    <div className="flex flex-col md:flex-row items-center justify-between mb-6">
      <h1 className="text-2xl font-bold text-gray-800">
        Hello {userName} 👋
      </h1>
      <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
        <Button
          style={{
            backgroundColor: filterType === "All" ? "#4B71F0" : undefined,
            color: filterType === "All" ? "white" : undefined,
            borderColor: "#4B71F0",
          }}
          onClick={() => setFilterType("All")}
        >
          All
        </Button>

        <Button
          style={{
            backgroundColor: filterType === "Income" ? "#4B71F0" : undefined,
            color: filterType === "Income" ? "white" : undefined,
            borderColor: "#4B71F0",
          }}
          onClick={() => setFilterType("Income")}
        >
          Income
        </Button>

        <Button
          style={{
            backgroundColor: filterType === "Expense" ? "#4B71F0" : undefined,
            color: filterType === "Expense" ? "white" : undefined,
            borderColor: "#4B71F0",
          }}
          onClick={() => setFilterType("Expense")}
        >
          Expense
        </Button>

        <Button
          onClick={handleLogout}
          style={{ backgroundColor: "#F44336", color: "white", borderColor: "#F44336" }}
        >
          <MdLogout /> Logout
        </Button>
      </div>
    </div>
  <card>
        {/* Action Buttons */}
    <div className="flex flex-wrap gap-4 mb-8">
      <Link to="/planning" className="flex-1">
          <Button className="w-full rounded-lg bg-gradient-to-r from-slate-600 to-slate-700 text-white border-0 shadow-lg hover:shadow-xl hover:from-slate-700 hover:to-slate-800 transition-all duration-300 font-semibold h-12">
          📈 Plan & Achievements
          </Button>
        </Link>

        <Link to="/wishlist" className="flex-1">
          <Button className="w-full rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-600 text-white border-0 shadow-lg hover:shadow-xl hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300 font-semibold h-12">
            ⭐ Wish List
          </Button>
        </Link>

          <Link to="/taskbudget" className="flex-1">
      <Button className="w-full rounded-lg bg-gradient-to-r from-teal-500 to-teal-600 text-white border-0 shadow-lg hover:shadow-xl hover:from-teal-600 hover:to-teal-700 transition-all duration-300 font-semibold h-12">
        💰 Budget Plan
      </Button>
    </Link>
  </div>
  </card>

    {/* =================== FINANCIAL OVERVIEW =================== */}
    <div className="bg-white p-6 rounded-2xl shadow-md mb-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">Financial Overview</h2>

      {/* Percentages */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 text-center">
        <div
          className="bg-green-100 p-4 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md hover:bg-green-200 hover:scale-105 hover:-translate-y-1"
        >
          <h3 className="text-lg font-semibold text-green-600">Income</h3>
          <p className="text-2xl font-bold text-green-800">{incomePercent}%</p>
        </div>
        <div
          className="bg-red-100 p-4 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md hover:bg-red-200 hover:scale-105 hover:-translate-y-1"
        >
          <h3 className="text-lg font-semibold text-red-600">Expense</h3>
          <p className="text-2xl font-bold text-red-800">{expensePercent}%</p>
        </div>
          <div
            className={`bg-blue-100 p-4 rounded-xl shadow-sm transition-all duration-300
              ${
                balancePercent >= 0
                  ? "hover:bg-blue-200 hover:shadow-md hover:scale-105 hover:-translate-y-1"
                  : "bg-red-100 hover:bg-red-200 hover:shadow-md hover:scale-105 hover:-translate-y-1"
              }`}
          >
            <h3
              className={`text-lg font-semibold ${
                balancePercent >= 0 ? "text-blue-700" : "text-red-700"
              }`}
            >
              {balancePercent >= 0 ? "Balance" : "Lost"}
            </h3>

            <p
              className={`text-2xl font-bold ${
                balancePercent >= 0 ? "text-blue-800" : "text-red-600"
              }`}
            >
              {Math.abs(balancePercent)}%
            </p>
          </div>

      </div>

      <div className="flex flex-col md:flex-row justify-around items-center gap-8 w-full">
        {/* Pie Chart */}
        <div className="w-full md:w-1/2 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <defs>
                {/* Darker Green */}
                <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#059669" stopOpacity={0.9} />  {/* darker green */}
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0.7} />
                </linearGradient>

                {/* Darker Red */}
                <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#b91c1c" stopOpacity={0.9} />  {/* darker red */}
                  <stop offset="100%" stopColor="#ef4444" stopOpacity={0.7} />
                </linearGradient>

                {/* Darker Blue */}
                <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1e40af" stopOpacity={0.9} />  {/* darker blue */}
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.7} />
                </linearGradient>
              </defs>

              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={(entry) => `${entry.name}: ${formatCurrency(entry.value)}`}
              >
                {chartData.map((entry, index) => {
                  let gradient = 'url(#incomeGradient)';
                  if (entry.name === 'Expense') gradient = 'url(#expenseGradient)';
                  if (entry.name === 'Balance') gradient = 'url(#balanceGradient)';
                  return <Cell key={index} fill={gradient} />;
                })}
              </Pie>
              <Tooltip formatter={(value) => `Rs. ${formatCurrency(value)}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
          <div className="w-full md:w-1/2 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <defs>
                <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#34d399" stopOpacity={0.3} />
                </linearGradient>
                <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#f87171" stopOpacity={0.3} />
                </linearGradient>
                <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.3} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `Rs. ${formatCurrency(value)}`} />
              <Legend />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {chartData.map((entry, index) => {
                  let gradient = 'url(#incomeGradient)';
                  if (entry.name === 'Expense') gradient = 'url(#expenseGradient)';
                  if (entry.name === 'Balance') gradient = 'url(#balanceGradient)';
                  return <Cell key={index} fill={gradient} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
    {/* start */}

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div
        className="bg-green-100 p-5 rounded-2xl text-center shadow-md transition-all duration-300 hover:bg-green-200 hover:shadow-lg hover:scale-105 hover:-translate-y-1"
      >
        <h2 className="text-xl font-semibold text-green-600">Total Income</h2>
        <p className="text-2xl font-bold text-green-800">Rs. {formatCurrency(totalIncome)}</p>
      </div>
      <div
        className="bg-red-100 p-5 rounded-2xl text-center shadow-md transition-all duration-300 hover:bg-red-200 hover:shadow-lg hover:scale-105 hover:-translate-y-1"
      >
        <h2 className="text-xl font-semibold text-red-600">Total Expense</h2>
        <p className="text-2xl font-bold text-red-800">Rs. {formatCurrency(totalExpense)}</p>
      </div>

        <div
          className={`p-5 rounded-2xl text-center shadow-md transition-all duration-300 
            ${
              balance >= 0
                ? "bg-blue-100 hover:bg-blue-200 hover:shadow-lg hover:scale-105 hover:-translate-y-1"
                : "bg-red-100 hover:bg-red-200 hover:shadow-lg hover:scale-105 hover:-translate-y-1"
            }`}
        >
          <h2
            className={`text-xl font-semibold ${
              balance >= 0 ? "text-blue-600" : "text-red-600"
            }`}
          >
            {balance >= 0 ? "Balance" : "In Debt"}
          </h2>

          <p
            className={`text-2xl font-bold ${
              balance >= 0 ? "text-blue-800" : "text-red-600"
            }`}
          >
            Rs. {formatCurrency(Math.abs(balance))}
          </p>
        </div>

    </div>

    {/* ✅ TRANSACTION TABLE SECTION - MOVED UP */}
    <div className="space-y-4 mb-6">
      {/* Search and Toggle Inactive - Now on the same row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        {/* Search field moved to left */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search transactions..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Toggle Inactive Button */}
        <Button
          type={showInactive ? "primary" : "default"}
          onClick={handleToggleInactive}
          style={{
            backgroundColor: showInactive ? "#4B71F0" : "#E5E7EB",
            color: showInactive ? "white" : "black",
            borderColor: "#4B71F0",
          }}
        >
          {showInactive ? "Show Active Transactions" : "Show Inactive Transactions"}
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Loading transactions...</p>
        </div>
      ) : (
        <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
          {/* Scrollable Table Container */}
          <div className="overflow-x-auto max-h-96"> {/* Adjust max-height as needed */}
            <table className="w-full border-collapse">
              <thead className="bg-gray-200 sticky top-0 z-10">
                <tr className="text-left text-gray-700 font-semibold">
                  <th className="p-3 bg-gray-200">Name</th>
                  <th className="p-3 bg-gray-200">Date</th>
                  <th className="p-3 bg-gray-200">Type</th>
                  <th className="p-3 bg-gray-200">Category</th>
                  <th className="p-3 bg-gray-200">Amount</th>
                  <th className="p-3 bg-gray-200">Note</th>
                  <th className="p-3 bg-gray-200">Status</th>
                  <th className="p-3 bg-gray-200 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((t, i) => (
                    <tr
                      key={t.id || i}
                      className={`border-b hover:bg-gray-50 transition ${
                        t.type?.toLowerCase() === "income" ? "text-green-700" : "text-red-700"
                      }`}
                    >
                      <td className="p-3 font-medium">{t.name}</td>
                      <td className="p-3">
                        {new Date(t.date).toISOString().split("T")[0]}
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            t.type?.toLowerCase() === "income"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {t.type}
                        </span>
                      </td>
                      <td className="p-3">{t.category}</td>
                      <td className="p-3 font-semibold">Rs. {formatCurrency(t.amount)}</td>
                      <td className="p-3 max-w-xs truncate">{t.note || "-"}</td>
                      <td className="p-3 text-center">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            t.status?.toLowerCase() === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          {t.status || "Inactive"}
                        </span>
                      </td>
                      <td className="p-3 flex justify-center gap-3">
                        <button
                          onClick={() => handleEditTransaction(t)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <MdEdit size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="p-8 text-center text-gray-500">
                      No transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>

    <br></br>

        {/* Add PDF Button */}
        <Button
          onClick={handleGeneratePDF}
          style={{ 
            backgroundColor: '#F59E0B', 
            color: 'white', 
            borderColor: '#F59E0B' 
          }}
          icon={<MdPictureAsPdf />}
        >
          Generate PDF
        </Button>
        {/* Add PDF Preview Modal */}
        {showPdfPreview && pdfData && (
          <PdfPreview
            visible={showPdfPreview}
            onClose={handleClosePdfPreview}
            transactions={pdfData.transactions}
            filters={pdfData.filters}
            totals={pdfData.totals}
            userName={pdfData.userName}
            onDownload={handleDownloadPDF}
          />
         )}
         <br></br>
       
    {/* ✅ TRANSACTION FORM */}
    {showForm && (
      <TransactionForm
        Selection={selectedTransaction}
        type={
          selectedTransaction
            ? selectedTransaction.type
            : filterType === "All"
            ? "Income"
            : filterType
        }
        onClose={handleCloseForm}
        onAddEdit={handleAddEditComplete}
      />
    )}
  </div>
  );
};

export default Dashboard;

