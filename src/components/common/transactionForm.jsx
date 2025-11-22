import React, { useEffect, useState } from "react";
import { message } from "antd";
import {
  addTransaction,
  getCategories,
  updateTransaction,
} from "../../Services/transactionService";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { FaXmark } from "react-icons/fa6";
import "./../../index.css";

const TransactionForm = ({ Selection, type, onClose, onAddEdit }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId } = useAuth();

  const [incomeCategories, setIncomeCategories] = useState([]);
  const [expenseCategories, setExpenseCategories] = useState([]);
  const [istransactionAddEdit, setIstransactionAddEdit] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    transactionId: "",
    user: userId,
    name: "",
    date: "",
    category: Selection?.category || "",
    amount: 0,
    note: "",
    type: type || Selection?.type || "",
    status: Selection?.status || "Active",
  });

  const backgroundColor =
    formData.type === "Income"
      ? "bg-gradient-to-r from-green-400 via-green-500 to-green-600"
      : "bg-gradient-to-r from-red-500 via-red-600 to-red-700";

  const backgroundColor2 = "bg-white";
  const textColor = "text-[white]";
  const shadow = "focus:shadow-neutral-500";

  useEffect(() => {
    if (Selection) {
      const storedTransactionId = localStorage.getItem("TransactionID");
      setFormData({
        transactionId:
          storedTransactionId || Selection.transactionId || Selection.id || "",
        user: Selection.user || userId,
        type: Selection.type || "",
        name: Selection.name || "",
        date: Selection.date || "",
        category: Selection.category || "",
        amount: Selection.amount || 0,
        note: Selection.note || "",
        status: Selection.status || "Active",
      });
    } else if (type) {
      setFormData((prev) => ({ ...prev, type }));
    }

    const loadCategories = async () => {
      try {
        const categoriesData = await getCategories(userId);
        setIncomeCategories(
          categoriesData?.income ??
            categoriesData?.Income ??
            categoriesData?.incomeCategories ??
            []
        );
        setExpenseCategories(
          categoriesData?.expense ??
            categoriesData?.Expense ??
            categoriesData?.expenseCategories ??
            []
        );
      } catch (err) {
        console.error("Error loading categories:", err);
        setIncomeCategories([]);
        setExpenseCategories([]);
      }
    };

    loadCategories();
  }, [Selection, type, userId]);

  useEffect(() => {
    if (istransactionAddEdit) {
      onAddEdit?.();
      setIstransactionAddEdit(false);
    }
  }, [istransactionAddEdit, onAddEdit]);

  // ----------------------- VALIDATION -----------------------
  const validateForm = (name, value) => {
    const errors = {};
    switch (name) {
      case "name":
        if (!value.trim()) errors.name = "Name is required.";
        else if (value.length < 3 || value.length > 50)
          errors.name = "Name must be between 3 and 50 characters.";
        break;
      case "date":
        if (!value.trim()) errors.date = "Date is required.";
        else if (isNaN(new Date(value).getTime()))
          errors.date = "Invalid date format.";
        else if (new Date(value) > new Date())
          errors.date = "Date cannot be in the future.";
        break;
      case "category":
        if (!value.trim()) errors.category = "Category is required.";
        break;
      case "amount":
        if (!value || value == 0)
          errors.amount = "Amount must be greater than 0.";
        else if (isNaN(value)) errors.amount = "Amount must be a number.";
        else if (value < 0) errors.amount = "Amount cannot be negative.";
        break;
      case "note":
        if (value.length > 200)
          errors.note = "Note cannot exceed 200 characters.";
        break;
      default:
        break;
    }
    return errors;
  };

  const validateFormData = (formData) => {
    const errors = {};
    Object.keys(formData).forEach((field) => {
      const fieldErrors = validateForm(field, formData[field]);
      if (fieldErrors[field]) errors[field] = fieldErrors[field];
    });
    return errors;
  };

  // ----------------------- HANDLERS -----------------------
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));

    const fieldError = validateForm(id, value);
    setErrors((prev) => {
      if (!fieldError[id]) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, ...fieldError };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateFormData(formData);
    setErrors(errors);
    if (Object.keys(errors).length > 0) {
      message.error("Please correct the highlighted errors.");
      return;
    }

    try {
      await addTransaction({ ...formData });
      message.success("Transaction added successfully!");
      setIstransactionAddEdit(true);

      setTimeout(() => {
        setFormData({
          name: "",
          date: "",
          category: "",
          amount: 0,
          note: "",
          type: type || Selection?.type,
          status: "Active",
        });
        onClose?.();
      }, 600);
    } catch (error) {
      console.error("Error submitting transaction:", error);
      message.error("Failed to add transaction!");
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    const errors = validateFormData(formData);
    setErrors(errors);
    if (Object.keys(errors).length > 0) {
      message.error("Please correct the highlighted errors.");
      return;
    }

    try {
      await updateTransaction(formData);
      message.success("Transaction updated!");
      setIstransactionAddEdit(true);

      setTimeout(() => {
        localStorage.removeItem("TransactionID");
        setFormData({
          name: "",
          date: "",
          category: "",
          amount: 0,
          note: "",
          type: type || Selection?.type,
          status: "Active",
        });
        onClose?.();
      }, 600);
    } catch (error) {
      console.error("Error updating transaction:", error);
      message.error("Failed to update transaction!");
    }
  };

  const categoryList =
    formData.type === "Income"
      ? incomeCategories ?? []
      : expenseCategories ?? [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent">
      <div className="flex w-[95%] md:w-[25%] rounded-xl">
        <form
          className={`${backgroundColor2} border-[2px] w-full border-golden shadow-md rounded-2xl pb-3 text-gray-900 font-medium text-sm`}
        >
          {/* Header */}
          <div className="flex items-end justify-end w-full p-1">
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 text-gray-600 hover:text-[#4B71F0]"
            >
              <FaXmark />
            </button>
          </div>

          <div className="flex flex-col px-3">
            <div className="flex w-full justify-between rounded-t-[15px] items-end mb-2">
              <h1
                className={`flex shadow-md ${backgroundColor} ${textColor} justify-between rounded-xl font-bold px-3 py-1.5 w-full text-sm`}
              >
                <span>Enter {formData.type}</span>
              </h1>
            </div>

            {/* Inputs */}
            <div className="flex flex-col text-xs lg:text-sm gap-1.5">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block mb-0.5 text-gray-700">
                  Transaction Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Transaction Name"
                  className={`peer block h-[36px] border ${shadow} ${
                    errors.name ? "border-red-500" : "border-golden"
                  } rounded-lg w-full px-2 py-1 bg-transparent`}
                />
                {errors.name && (
                  <p className="text-red-500 text-[10px]">{errors.name}</p>
                )}
              </div>

              {/* Date */}
              <div>
                <label htmlFor="date" className="block mb-0.5 text-gray-700">
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  value={formData.date}
                  onChange={handleChange}
                  className={`peer block h-[36px] border rounded-lg w-full px-2 py-1 bg-transparent`}
                />
              </div>

              {/* Amount */}
              <div>
                <label htmlFor="amount" className="block mb-0.5 text-gray-700">
                  Amount
                </label>
                <input
                  type="number"
                  id="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  className={`peer block h-[36px] border ${shadow} ${
                    errors.amount ? "border-red-500" : "border-golden"
                  } rounded-lg w-full px-2 py-1 bg-transparent`}
                />
                {errors.amount && (
                  <p className="text-red-500 text-[10px]">{errors.amount}</p>
                )}
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block mb-0.5 text-gray-700">
                  Category
                </label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`peer block h-[36px] border ${shadow} ${
                    errors.category ? "border-red-500" : "border-golden"
                  } rounded-lg w-full px-2 py-1 bg-transparent`}
                >
                  <option value="">Select</option>
                  {formData.type?.toLowerCase() === "expense"
                    ? (expenseCategories.length > 0
                        ? expenseCategories
                        : [
                            "FOOD",
                            "MEDICATION",
                            "TRANSPORT",
                            "TAXES",
                            "EDUCATION",
                            "BILLS",
                            "ENTERTAINMENT",
                            "REPAIRS",
                            "CHARITY",
                          ]
                      ).map((cat, index) => (
                        <option key={index} value={cat}>
                          {cat}
                        </option>
                      ))
                    : (incomeCategories.length > 0
                        ? incomeCategories
                        : ["SALARY", "MY OWN"]
                      ).map((cat, index) => (
                        <option key={index} value={cat}>
                          {cat}
                        </option>
                      ))}
                </select>
                {errors.category && (
                  <p className="text-red-500 text-[10px]">{errors.category}</p>
                )}
              </div>

              {/* Status */}
              <div>
                <label htmlFor="status" className="block mb-0.5 text-gray-700">
                  Status
                </label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="peer block h-[36px] border border-golden rounded-lg w-full px-2 py-1 bg-transparent"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              {/* Note */}
              <div>
                <label htmlFor="note" className="block mb-0.5 text-gray-700">
                  Note
                </label>
                <textarea
                  id="note"
                  value={formData.note}
                  onChange={handleChange}
                  placeholder="Note"
                  className={`peer block h-[48px] border ${shadow} ${
                    errors.note ? "border-red-500" : "border-golden"
                  } rounded-lg w-full px-2 py-1 bg-transparent`}
                />
                {errors.note && (
                  <p className="text-red-500 text-[10px]">{errors.note}</p>
                )}
              </div>
            </div>

            {/* Button */}
            <div className="flex justify-end mt-2">
              <button
                type="button"
                onClick={Selection ? handleEdit : handleSubmit}
                className={`flex text-xs lg:text-sm border-[1.5px] px-3 py-1.5 text-center border-white shadow-sm items-center hover:shadow-white rounded-lg text-white ${backgroundColor}`}
              >
                {Selection ? "Update" : "Insert"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;


// import React, { useEffect, useState } from "react";
// import { message } from "antd";
// import {
//   addTransaction,
//   getCategories,
//   updateTransaction,
// } from "../../Services/transactionService";
// import { useLocation, useNavigate } from "react-router-dom";
// import { useAuth } from "../../hooks/useAuth";
// import { FaXmark } from "react-icons/fa6";
// import "./../../index.css";

// const TransactionForm = ({ Selection, type, onClose, onAddEdit }) => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { userId } = useAuth();

//   const [incomeCategories, setIncomeCategories] = useState([]);
//   const [expenseCategories, setExpenseCategories] = useState([]);
//   const [istransactionAddEdit, setIstransactionAddEdit] = useState(false);
//   const [errors, setErrors] = useState({});

//   // ✅ Include `status` in your form data
//   const [formData, setFormData] = useState({
//     transactionId: "",
//     user: userId,
//     name: "",
//     date: "",
//     category: Selection?.category || "",
//     amount: 0,
//     note: "",
//     type: type || Selection?.type || "",
//     status: Selection?.status || "Active", // ✅ Default to Active
//   });

//   const backgroundColor =
//     formData.type === "Income"
//       ? "bg-gradient-to-r from-green-400 via-green-500 to-green-600"
//       : "bg-gradient-to-r from-red-500 via-red-600 to-red-700";
//   const backgroundColor2 = "bg-white";
//   const textColor = "text-[white]";
//   const shadow = "focus:shadow-neutral-500";

//   // ✅ Load categories and handle edit mode
//   useEffect(() => {
//     if (Selection) {
//       const storedTransactionId = localStorage.getItem("TransactionID");
//       setFormData({
//         transactionId:
//           storedTransactionId || Selection.transactionId || Selection.id || "",
//         user: Selection.user || userId,
//         type: Selection.type || "",
//         name: Selection.name || "",
//         date: Selection.date || "",
//         category: Selection.category || "",
//         amount: Selection.amount || 0,
//         note: Selection.note || "",
//         status: Selection.status || "Active", // ✅ Add status here too
//       });
//     } else if (type) {
//       setFormData((prev) => ({ ...prev, type }));
//     }

//     const loadCategories = async () => {
//       try {
//         const categoriesData = await getCategories(userId);
//         setIncomeCategories(
//           categoriesData?.income ??
//             categoriesData?.Income ??
//             categoriesData?.incomeCategories ??
//             []
//         );
//         setExpenseCategories(
//           categoriesData?.expense ??
//             categoriesData?.Expense ??
//             categoriesData?.expenseCategories ??
//             []
//         );
//       } catch (err) {
//         console.error("Error loading categories:", err);
//         setIncomeCategories([]);
//         setExpenseCategories([]);
//       }
//     };

//     loadCategories();
//   }, [Selection, type, userId]);

//   useEffect(() => {
//     if (istransactionAddEdit) {
//       onAddEdit?.();
//       setIstransactionAddEdit(false);
//     }
//   }, [istransactionAddEdit, onAddEdit]);

//   // ----------------------- VALIDATION -----------------------
//   const validateForm = (name, value) => {
//     const errors = {};
//     switch (name) {
//       case "name":
//         if (!value.trim()) errors.name = "Name is required.";
//         else if (value.length < 3 || value.length > 50)
//           errors.name = "Name must be between 3 and 50 characters.";
//         break;
//       case "date":
//         if (!value.trim()) errors.date = "Date is required.";
//         else if (isNaN(new Date(value).getTime()))
//           errors.date = "Invalid date format.";
//         else if (new Date(value) > new Date())
//           errors.date = "Date cannot be in the future.";
//         break;
//       case "category":
//         if (!value.trim()) errors.category = "Category is required.";
//         break;
//       case "amount":
//         if (!value || value == 0)
//           errors.amount = "Amount must be greater than 0.";
//         else if (isNaN(value)) errors.amount = "Amount must be a number.";
//         else if (value < 0) errors.amount = "Amount cannot be negative.";
//         break;
//       case "note":
//         if (value.length > 200)
//           errors.note = "Note cannot exceed 200 characters.";
//         break;
//       default:
//         break;
//     }
//     return errors;
//   };

//   const validateFormData = (formData) => {
//     const errors = {};
//     Object.keys(formData).forEach((field) => {
//       const fieldErrors = validateForm(field, formData[field]);
//       if (fieldErrors[field]) errors[field] = fieldErrors[field];
//     });
//     return errors;
//   };

//   // ----------------------- HANDLERS -----------------------
//   const handleChange = (e) => {
//     const { id, value } = e.target;
//     setFormData((prev) => ({ ...prev, [id]: value }));

//     const fieldError = validateForm(id, value);
//     setErrors((prev) => {
//       if (!fieldError[id]) {
//         const { [id]: _, ...rest } = prev;
//         return rest;
//       }
//       return { ...prev, ...fieldError };
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const errors = validateFormData(formData);
//     setErrors(errors);
//     if (Object.keys(errors).length > 0) {
//       message.error("Please correct the highlighted errors.");
//       return;
//     }

//     try {
//       const response = await addTransaction({ ...formData });
//       message.success("Transaction added successfully!");
//       setIstransactionAddEdit(true);

//       setTimeout(() => {
//         setFormData({
//           name: "",
//           date: "",
//           category: "",
//           amount: 0,
//           note: "",
//           type: type || Selection?.type,
//           status: "Active", // ✅ Reset to Active
//         });
//         onClose?.();
//       }, 800);
//     } catch (error) {
//       console.error("Error submitting transaction:", error);
//       message.error("Failed to add transaction!");
//     }
//   };

//   const handleEdit = async (e) => {
//     e.preventDefault();
//     const errors = validateFormData(formData);
//     setErrors(errors);
//     if (Object.keys(errors).length > 0) {
//       message.error("Please correct the highlighted errors.");
//       return;
//     }

//     try {
//       await updateTransaction(formData);
//       message.success("Transaction updated!");
//       setIstransactionAddEdit(true);

//       setTimeout(() => {
//         localStorage.removeItem("TransactionID");
//         setFormData({
//           name: "",
//           date: "",
//           category: "",
//           amount: 0,
//           note: "",
//           type: type || Selection?.type,
//           status: "Active",
//         });
//         onClose?.();
//       }, 800);
//     } catch (error) {
//       console.error("Error updating transaction:", error);
//       message.error("Failed to update transaction!");
//     }
//   };

//   // ----------------------- RENDER -----------------------
//   const categoryList =
//     formData.type === "Income"
//       ? incomeCategories ?? []
//       : expenseCategories ?? [];


//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent">
//       <div className="flex w-[90%] md:w-[30%] rounded-2xl">
//         <form
//           className={`${backgroundColor2} border-[3px] w-full border-golden shadow-lg rounded-3xl pb-5 text-gray-900 font-semibold text-base`}
//         >
//           {/* Header */}
//           <div className="flex items-end justify-end w-full">
//             <button
//               type="button"
//               onClick={onClose}
//               className="w-10 h-10 text-gray-600 hover:text-[#4B71F0]"
//             >
//               <FaXmark />
//             </button>
//           </div>

//           <div className="flex flex-col px-5">
//             <div className="flex w-full justify-between rounded-t-[20px] items-end">
//               <h1
//                 className={`flex shadow-md ${backgroundColor} ${textColor} justify-between rounded-3xl font-bold px-4 py-2 w-full`}
//               >
//                 <span className="lg:text-lg bg-transparent text-md w-full">
//                   Enter {formData.type}
//                 </span>
//               </h1>
//             </div>

//             {/* Inputs */}
//             <div className="flex flex-col text-sm lg:text-md gap-1.5 m-2 mt-3">
//               {/* Name */}
//               <div className="relative my-1">
//                 <label htmlFor="name" className="block mb-1 text-gray-700">
//                   Transaction Name
//                 </label>
//                 <input
//                   type="text"
//                   id="name"
//                   value={formData.name}
//                   onChange={handleChange}
//                   placeholder="Transaction Name"
//                   className={`peer block h-[44px] border ${shadow} ${
//                     errors.name ? "border-red-500" : "border-golden"
//                   } rounded-xl w-full px-3 py-2 bg-transparent`}
//                 />
//                 {errors.name && (
//                   <p className="text-red-500 text-xs mt-1">{errors.name}</p>
//                 )}
//               </div>

//               {/* Date */}
  
//             <div className="relative my-1">
//               <label htmlFor="date" className="block mb-1 text-gray-700">
//                 Date               </label>
//               <input
//                 type="date"
//                id="date"
//                  value={formData.date || new Date().toISOString().split("T")[0]}
//                 onChange={handleChange}
//                 className={`peer block h-[58px] border ${shadow} ${
//                   errors.date ? "border-red-500" : "border-golden"
//                } rounded-xl w-full px-3 py-4 bg-transparent`}
//               />
//               {errors.date && (
//                <p className="text-red-500 text-xs mt-1">{errors.date}</p>
//               )}
//            </div>
              

//               {/* Amount */}
//               <div className="relative my-1">
//                 <label htmlFor="amount" className="block mb-1 text-gray-700">
//                   Amount
//                 </label>
//                 <input
//                   type="number"
//                   id="amount"
//                   value={formData.amount}
//                   onChange={handleChange}
//                   className={`peer block h-[58px] border ${shadow} ${
//                     errors.amount ? "border-red-500" : "border-golden"
//                   } rounded-xl w-full px-3 py-4 bg-transparent`}
//                 />
//                 {errors.amount && (
//                   <p className="text-red-500 text-xs mt-1">{errors.amount}</p>
//                 )}
//               </div>

//             {/* Category */}
//             <div className="relative my-1">
//             <label htmlFor="category" className="block mb-1 text-gray-700">
//               Category
//             </label>

//             <select
//               id="category"
//               value={formData.category}
//               onChange={handleChange}
//               className={`peer block h-[58px] border ${shadow} ${
//                 errors.category ? "border-red-500" : "border-golden"
//               } rounded-xl w-full px-3 py-4 bg-transparent`}
//             >
//               <option value="">Select a category</option>

//               {/* ✅ Dynamically show options based on transaction type */}
//               {formData.type?.toLowerCase() === "expense"
//                 ? // EXPENSE CATEGORIES
//                   expenseCategories.length > 0
//                   ? expenseCategories.map((cat, index) => (
//                       <option key={index} value={cat}>
//                         {cat}
//                       </option>
//                     ))
//                   : [
//                       "FOOD",
//                       "MEDICATION",
//                       "TRANSPORT",
//                       "TAXES",
//                       "EDUCATION",
//                       "BILLS",
//                       "ENTERTAINMENT",
//                       "REPAIRS",
//                       "CHARITY",
//                     ].map((cat) => (
//                       <option key={cat} value={cat}>
//                         {cat === "BILLS"
//                           ? "UTILITIES (WATER, ELECTRICITY, INTERNET)"
//                           : cat === "REPAIRS"
//                           ? "MAINTENANCE / REPAIRS"
//                           : cat === "CHARITY"
//                           ? "CHARITY / DONATION"
//                           : cat}
//                       </option>
//                     ))
//                 : // INCOME CATEGORIES
//                   incomeCategories.length > 0
//                   ? incomeCategories.map((cat, index) => (
//                       <option key={index} value={cat}>
//                         {cat}
//                       </option>
//                     ))
//                   : ["SALARY", "MY OWN"].map((cat) => (
//                       <option key={cat} value={cat}>
//                         {cat}
//                       </option>
//                     ))}
//             </select>

//             {errors.category && (
//               <p className="text-red-500 text-xs mt-1">{errors.category}</p>
//             )}
//           </div>

//               {/* ✅ STATUS FIELD */}
//               <div className="relative my-1">
//                 <label htmlFor="status" className="block mb-1 text-gray-700">
//                   Status
//                 </label>
//                 <select
//                   id="status"
//                   value={formData.status}
//                   onChange={handleChange}
//                   className={`peer block h-[58px] border ${shadow} rounded-xl w-full px-3 py-4 bg-transparent`}
//                 >
//                   <option value="Active">Active</option>
//                   <option value="Inactive">Inactive</option>
//                 </select>
//               </div>

//               {/* Note */}
//               <div className="relative my-1">
//                 <label htmlFor="note" className="block mb-1 text-gray-700">
//                   Note
//                 </label>
//                 <textarea
//                   id="note"
//                   value={formData.note}
//                   onChange={handleChange}
//                   placeholder="Note"
//                   className={`peer block h-[58px] border ${shadow} ${
//                     errors.note ? "border-red-500" : "border-golden"
//                   } rounded-xl w-full px-3 py-4 bg-transparent`}
//                 />
//                 {errors.note && (
//                   <p className="text-red-500 text-xs mt-1">{errors.note}</p>
//                 )}
//               </div>
//             </div>

//             {/* Button */}
//             <div className="flex justify-end mt-4">
//               <button
//                 type="button"
//                 onClick={Selection ? handleEdit : handleSubmit}
//                 className={`flex text-sm lg:text-md border-[2px] p-4 h-2 text-center border-white shadow-sm items-center hover:shadow-white hover:shadow rounded-xl text-white ${backgroundColor}`}
//               >
//                 {Selection ? "Update" : "Insert"}
//               </button>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default TransactionForm;
