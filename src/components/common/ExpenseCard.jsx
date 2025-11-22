// import React, { useReducer, useState } from "react";
// import { FaXmark } from "react-icons/fa6";
// import { FaEdit } from "react-icons/fa";
// import { message } from "antd";
// import { MdDateRange } from "react-icons/md";
// import { TiPlus } from "react-icons/ti";
// import { FaMinus } from "react-icons/fa";
// import { deleteTransaction } from "../../Services/transactionService";
// import { useNavigate } from "react-router-dom";
// import {
//   FaMoneyBillWave,
//   FaBriefcase,
//   FaBuilding,
//   FaPiggyBank,
//   FaLaptopCode,
//   FaChartLine,
//   FaGift,
//   FaEllipsisH,
//   FaHome,
//   FaUtensils,
//   FaCar,
//   FaFirstAid,
//   FaBook,
//   FaFilm,
//   FaCreditCard
// } from 'react-icons/fa';

// const initialState = { transactionItems: [] };
// const reducer = (state, action) => {
//   switch (action.type) {
//     case "Transactions_Loaded":
//       return { ...state, transactionItems: action.payload };
//     default:
//       return state;
//   }
// };

// const ExpenseCard = ({selection, onDelete, onOpen, transactionID}) => {

//   const [state,dispatch] = useReducer(reducer,initialState);
//   const {transactionItems} = state
//   const [deletingTransactionId, setDeletingTransactionId] = useState();
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [selectedTransactionDelete, setSelectedTransactionDelete] = useState();
//   const navigate = useNavigate();
//   // const CATEGORIES = {
//   //   income: ['Salary/Wages','Business', 'Rental', 'Pension', 'Freelance/Side Hustle', 'Investments', 'Gift/Donations', 'Other'],
//   //   expense: ['Housing & Utilities', 'Food & Groceries', 'Transportation', 'Health & Medical', 'Education', 'Entertainment & Leisure', 'Debt Repayments','Savings & Investments']
//   // };
  
//   const categoryIcons = {
//     'Salary/Wages': <FaMoneyBillWave style={{ color: '#048320', width:20, height:20 }}/>,
//     'Business': <FaBriefcase style={{ color: '#7d3d01', width:20, height:20 }}/>,
//     'Rental': <FaBuilding style={{ color: '#826f5d', width:20, height:20 }}/>,
//     'Pension': <FaPiggyBank style={{ color: '#3a7086' , width:20, height:20}}/>,
//     'Freelance/Side Hustle': <FaLaptopCode style={{ color: '#7e3244', width:20, height:20 }}/>,
//     'Investments': <FaChartLine style={{ color: '#e25a71' , width:20, height:20}}/>,
//     'Gift/Donations': <FaGift style={{ color: '#7e3278', width:20, height:20 }}/>,
//     'Other': <FaEllipsisH style={{ color: '#b53604' , width:20, height:20}}/>,
//     'Housing & Utilities': <FaHome style={{ color: '#183639', width:20, height:20 }}/>,
//     'Food & Groceries': <FaUtensils style={{ color: '#7e3244' , width:20, height:20}}/>,
//     'Transportation': <FaCar style={{ color: '#03036b', width:20, height:20 }}/>,
//     'Health & Medical': <FaFirstAid style={{ color: '#007252', width:20, height:20 }}/>,
//     'Education': <FaBook style={{ color: '#adb303', width:20, height:20 }}/>,
//     'Entertainment & Leisure': <FaFilm style={{ color: '#ac0b9a', width:20, height:20 }}/>,
//     'Debt Repayments': <FaCreditCard style={{ color: '#d95442', width:20, height:20 }}/>,
//     'Savings & Investments': <FaPiggyBank style={{ color: '#01a1ac', width:20, height:20 }}/>
//   };
  

//   // useEffect(() =>{
//   //   dispatch({
//   //     type: "Transactions_Loaded",
//   //     payload: selection,
//   //   });
//   // },[selection]);

//   const handleDelete = async (transactionID) => {
//     setDeletingTransactionId(transactionID);
//     transactionID(transactionID)
//     //setShowDeleteModal(true);
//   };
//   const confirmDelete = async() => {
//     try {
//       await deleteTransaction(deletingTransactionId);
//       console.log("deleted", setDeletingTransactionId);
//       dispatch({
//         type: "Transactions_Loaded",
//         payload: transactionItems.filter((item) => item.transactionId !== deletingTransactionId),
        
//       });
//       if (onDelete) onDelete(deletingTransactionId);
//       message.success("Successfully deleted the transaction!")
//       setTimeout(() => {
        
//       }, 1000);
//       //window.location.reload();
//     } catch (error) {
//       console.error("Error deleting transaction:", error);
//       message.error("Deletion failed!")
//     }
//   }
//   const handleEdit = async () => {
//     // navigate("/Form", { state:{Selection:selection}})
//     // console.log("Update selection:", selection)
//     onOpen(selection);
//   };

//   return (
//     <>
//     <tr className="flex md:w-full w-[600px] bg-gray-50 border-y-[1px] p-2 shadow-[0_4px_9px_-4px_#9e9e9e] border-gray-200 text-black rounded-xl">
//       <td className="flex flex-col w-[35%] pl-1 bg-white backdrop-blur-sm rounded-l justify-start items-start ">
//         <div className="font-bold text-center text-wrap text-[12px] md:text-[16px]">{selection.name}</div>
//         <div className="font-semibold text-center text-wrap text-[10px] md:text-[14px] text-subText">{selection.note}</div>
//       </td>
//       <td className="flex w-[20%]  bg-white justify-start text-wrap items-center pl-1 font-semibold text-center text-[10px] md:text-[14px]">
//         {categoryIcons[selection.category] || <FaEllipsisH />}&nbsp; {selection.category}
//       </td>
//       <td className="flex w-[15%] bg-white justify-start pl-0.5 md:p-1 gap-0.5 md:gap-1 items-center font-semibold text-center text-[8px] md:text-[14px]">
//         <MdDateRange />{selection.date}
//       </td>
//       <td  className={`flex w-[15%] ${(selection.type === "Income")?"text-incomeAmount": "text-expenseAmount"} bg-white justify-start pl-1 gap-1 items-center font-bold text-center text-[10px] md:text-[14px]`} >
//       {selection.type === "Income"? <TiPlus />: <FaMinus />} Rs.{selection.amount}
//       </td>
//       <td className="flex w-[15%]  gap-0.5 md:gap-2 bg-white justify-center rounded-r items-center font-semibold text-center text-[0.8rem]">
//         <button type="submit" className="bg-transparent items-center rounded-full justify-center focus:ring-4 focus:outline-none hover:shadow-md focus:bg-slate-600 p-1 md:p-2 text-white font-extrabold text-sm md:text-xl"
//           onClick={() => handleDelete(selection.transactionId)}
//           >
//           <FaXmark style={{ color: '#ff0000cf' }}/>
//         </button>
//         <button type="submit" className=" items-center justify-center rounded-full focus:ring-4 focus:outline-none hover:shadow-md focus:bg-slate-600 p-1 md:p-2 text-white font-extrabold text-sm md:text-xl"
//          onClick={handleEdit}
//         >
//           <FaEdit style={{ color: '#334050' }}/>
//         </button>
//       </td>
//     </tr>
//     </>
//   );
// };
// export default ExpenseCard;

import React, { useReducer, useState } from "react";
import { FaXmark } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { message } from "antd";
import { MdDateRange } from "react-icons/md";
import { TiPlus } from "react-icons/ti";
import { FaMinus } from "react-icons/fa";
import { deleteTransaction } from "../../Services/transactionService";
import { useNavigate } from "react-router-dom";
import {
  FaMoneyBillWave,
  FaBriefcase,
  FaBuilding,
  FaPiggyBank,
  FaLaptopCode,
  FaChartLine,
  FaGift,
  FaEllipsisH,
  FaHome,
  FaUtensils,
  FaCar,
  FaFirstAid,
  FaBook,
  FaFilm,
  FaCreditCard
} from 'react-icons/fa';

const initialState = { transactionItems: [] };
const reducer = (state, action) => {
  switch (action.type) {
    case "Transactions_Loaded":
      return { ...state, transactionItems: action.payload };
    default:
      return state;
  }
};

const ExpenseCard = ({selection, onOpen, deleteModelOpened, deletingTransactionId}) => {

  const [state,dispatch] = useReducer(reducer,initialState);
  const {transactionItems} = state
  //const [deletingTransactionId, setDeletingTransactionId] = useState();
  
  const [selectedTransactionDelete, setSelectedTransactionDelete] = useState();
  const navigate = useNavigate();
  // const CATEGORIES = {
  //   income: ['Salary/Wages','Business', 'Rental', 'Pension', 'Freelance/Side Hustle', 'Investments', 'Gift/Donations', 'Other'],
  //   expense: ['Housing & Utilities', 'Food & Groceries', 'Transportation', 'Health & Medical', 'Education', 'Entertainment & Leisure', 'Debt Repayments','Savings & Investments']
  // };
  
  const categoryIcons = {
    'Salary/Wages': <FaMoneyBillWave style={{ color: '#00d0c2', width:20, height:20 }}/>,
    'Business': <FaBriefcase style={{ color: '#00d0c2', width:20, height:20 }}/>,
    'Rental': <FaBuilding style={{ color: '#00d0c2', width:20, height:20 }}/>,
    'Pension': <FaPiggyBank style={{ color: '#00d0c2' , width:20, height:20}}/>,
    'Freelance/Side Hustle': <FaLaptopCode style={{ color: '#00d0c2', width:20, height:20 }}/>,
    'Investments': <FaChartLine style={{ color: '#00d0c2' , width:20, height:20}}/>,
    'Gift/Donations': <FaGift style={{ color: '#00d0c2', width:20, height:20 }}/>,
    'Other': <FaEllipsisH style={{ color: '#00d0c2' , width:20, height:20}}/>,
    'Housing & Utilities': <FaHome style={{ color: '#EF854B', width:20, height:20 }}/>,
    'Food & Groceries': <FaUtensils style={{ color: '#EF854B' , width:20, height:20}}/>,
    'Transportation': <FaCar style={{ color: '#EF854B', width:20, height:20 }}/>,
    'Health & Medical': <FaFirstAid style={{ color: '#EF854B', width:20, height:20 }}/>,
    'Education': <FaBook style={{ color: '#EF854B', width:20, height:20 }}/>,
    'Entertainment & Leisure': <FaFilm style={{ color: '#EF854B', width:20, height:20 }}/>,
    'Debt Repayments': <FaCreditCard style={{ color: '#EF854B', width:20, height:20 }}/>,
    'Savings & Investments': <FaPiggyBank style={{ color: '#EF854B', width:20, height:20 }}/>
  };
  

  // useEffect(() =>{
  //   dispatch({
  //     type: "Transactions_Loaded",
  //     payload: selection,
  //   });
  // },[selection]);

  const handleDelete = async (transactionID) => {
    //setDeletingTransactionId(transactionID);
    //transactionID(transactionID);
    //setShowDeleteModal(true);
    //deletingTransactionId(transactionID);
    deleteModelOpened(transactionID);
  };
  

  const handleEdit = async () => {
    // navigate("/Form", { state:{Selection:selection}})
    // console.log("Update selection:", selection)
    onOpen(selection);
  };

  return (
    <>
    <tr className="flex md:w-full w-[600px] bg-white border-y-[1px] p-2 shadow-[0_4px_9px_-4px_#9e9e9e] border-gray-200 text-black rounded-xl">
      <td className="flex flex-col w-[35%] pl-1 bg-white backdrop-blur-sm rounded-l justify-start items-start ">
        <div className="font-bold text-center text-wrap text-[12px] md:text-[16px]">{selection.name}</div>
        <div className="font-semibold text-center text-wrap text-[10px] md:text-[14px] text-subText">{selection.note}</div>
      </td>
      <td className="flex w-[20%]  bg-white justify-start text-wrap items-center pl-1 font-semibold text-center text-[10px] md:text-[14px]">
        {categoryIcons[selection.category] || <FaEllipsisH />}&nbsp; {selection.category}
      </td>
      <td className="flex w-[15%] bg-white justify-start pl-0.5 md:p-1 gap-0.5 md:gap-1 items-center font-semibold text-center text-[8px] md:text-[14px]">
        <MdDateRange />{selection.date}
      </td>
      <td  className={`flex w-[15%] ${(selection.type === "Income")?"text-[#00d0c2]": "text-[#EF854B]"} bg-white justify-start pl-1 gap-1 items-center font-bold text-center text-[10px] md:text-[14px]`} >
      {selection.type === "Income"? <TiPlus />: <FaMinus />} Rs.{selection.amount}
      </td>
      <td className="flex w-[15%]  gap-0.5 md:gap-2 bg-white justify-center rounded-r items-center font-semibold text-center text-[0.8rem]">
        <button type="submit" className="bg-transparent items-center rounded-full justify-center focus:ring-4 focus:outline-none hover:shadow-md focus:bg-slate-600 p-1 md:p-2 text-white font-extrabold text-sm md:text-xl"
          onClick={() => handleDelete(selection.transactionId)}
          >
          <FaXmark style={{ color: '#ff0000cf' }}/>
        </button>
        <button type="submit" className=" items-center justify-center rounded-full focus:ring-4 focus:outline-none hover:shadow-md focus:bg-slate-600 p-1 md:p-2 text-white font-extrabold text-sm md:text-xl"
         onClick={handleEdit}
        >
          <FaEdit style={{ color: '#334050' }}/>
        </button>
      </td>
    </tr>

    
    </>
  );
};
export default ExpenseCard;