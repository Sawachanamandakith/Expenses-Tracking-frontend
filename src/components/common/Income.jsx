// import React, { useEffect, useState, useReducer } from "react";
// import { Tag } from "antd";
// import { ExpenseCard } from "./ExpenseCard";

// const Income = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//   };
  
//   const handleTag = (tag) => {
//     console.log('Tag clicked:', tag);
//   };
  
//   const showExpenses = () => {
//   };
  
//   const handleCardClick = (card) => {
//   };


//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-7 bg-incomeBC py-2">
//       <div className="  lg:col-span-3" >
//         <div className="">
//           <form className="bg-green-50 border-[3px] border-golden shadow-lg rounded-[20px] m-5 text-gray-900 font-semibold text-base">
//             <div className="flex flex-col p-5">
//                 <div className=" flex w-full h-72 shadow-md justify-end rounded-t-[20px] opacity-100 items-end bg-voucher bg-cover bg-center">
//                     <h1 className="flex shadow-md bg-incomeBC justify-between font-bold px-5 py-3 w-full ">
//                         <span className="text-2xl md:text-2xl text-black  ">
//                             Enter Your Incomes
//                         </span>
//                         <button className=" py-1  px-5 border-[2px] border-golden shadow-sm hover:shadow-golden hover:shadow-md  rounded">Add</button>
//                     </h1>
//                 </div>
//                 <div className="flex flex-col gap-2  m-5 mt-5">
//                   <div className="flex relative flex-row items-center justify-start  px-3">
//                     <label className="block mx-1 my-2 w-[20%] ">
//                       Income Name
//                     </label>
//                     <input
//                       type="text"
//                       id="incomeName"
//                       className="block p-2.5 mx-3 w-[60%] text-gray-600 bg-gray-100 focus:bg-white focus:border-[#C4896F] hover:bg-white text-sm rounded-lg border-b-4 border-incomeBC border-[1px]"
//                     >
//                       {/* {incomeName} */}
//                     </input>
//                   </div>
//                   <div className="flex relative flex-row items-center justify-start px-3">
//                     <label className="block mx-1 w-[20%] my-2 ">Date</label>
//                     <input
//                       type="date"
//                       id="date"
//                       className="block p-2.5 w-[40%] mx-3 border-b-4 text-sm text-gray-600 bg-gray-100 focus:bg-white hover:bg-white rounded-lg border-incomeBC border-[1px]"
//                     >
//                       {/* {" "}{date} */}
//                     </input>
//                   </div>
//                   <div className="flex relative flex-row items-center justify-start px-3">
//                     <label className="block mx-1 w-[20%] my-2 ">Amount</label>
//                     <input
//                       type="number"
//                       id="amount"
//                       className="block p-2.5 w-[40%] mx-3 border-b-4  text-sm text-gray-600 bg-gray-100 focus:bg-white hover:bg-white rounded-lg border-incomeBC border-[1px]"
//                     >
//                       {/* {" "}{amount} */}
//                     </input>
//                   </div>
//                   <div className="flex relative flex-row items-center justify-start px-3">
//                     <label className="block mx-1 my-2 w-[20%]">Category</label>
//                     <select className="block p-2.5 mx-3 border-b-4 w-[60%] text-sm text-gray-600 bg-gray-100 focus:bg-white hover:bg-white rounded-lg border-incomeBC border-[1px]">
//                         <option>None</option>
//                       <option>Salary</option>
//                       <option>Freelance</option>
//                       <option>Bonus and Commissions</option>
//                       <option>Business Investments</option>
//                     </select>

//                     {/* {" "}{category} */}
//                   </div>
//                   <div className="flex relative flex-row items-center justify-start px-3">
//                     <label className="block mx-1 my-2 w-[20%]">Note</label>
//                     <textarea
//                       type="textarea"
//                       id="Note"
//                       className="block p-2.5 w-[60%] mx-3 border-b-4 text-sm text-gray-600 bg-gray-100 focus:bg-white hover:bg-white rounded-lg border-incomeBC border-[1px]"
//                     >
//                       {/* {" "}{note} */}
//                     </textarea>
//                   </div>
//                 </div>
                
//               </div>
//           </form>
//         </div>
//       </div>
//       <div className="  lg:col-span-4 ">
//         <div className=" w-full h-full bg-white rounded-[40px] border-[1px] border-golden ">
//         <div>
//                 <div>
//                   <div>
//                     <div className="md:flex hidden flex-row justify-center items-center my-3 mx-10 text-black font-semibold">
//                       <Tag className=" w-full h-8 bg-golden hover:bg-slate-600 focus:bg-slate-600 text-[1rem] text-center  m-1 p-1 shadow-2xl cursor-pointer">
//                         All{" "}
//                       </Tag>
//                       <Tag className=" w-full h-8 bg-golden hover:bg-slate-600 focus:bg-slate-600 text-[1rem] text-center  m-1 p-1 shadow-2xl cursor-pointer">
//                         Salary{" "}
//                       </Tag>
//                       <Tag className=" w-full h-8 bg-golden hover:bg-slate-600 focus:bg-slate-600 text-[1rem] text-center m-1 p-1 shadow-2xl cursor-pointer">
//                         FreeLance{" "}
//                       </Tag>
//                       <Tag className=" w-full h-8 bg-golden hover:bg-slate-600 focus:bg-slate-600 text-[1rem] text-center m-1 p-1 shadow-2xl cursor-pointer">
//                         Bonus & Commisions{" "}
//                       </Tag>
//                       <Tag className=" w-full h-8 bg-golden hover:bg-slate-600 focus:bg-slate-600 text-[1rem] text-center m-1 p-1 shadow-2xl cursor-pointer">
//                         Business Investments{" "}
//                       </Tag>
//                     </div>
//                     <div className="flex md:hidden w-full items-center justify-end  ">
//                       <button
//                         onClick={toggleMenu}
//                         className="text-black focus:outline-none justify-end m-4 focus:test-gray-500  "
//                       >
//                         {/* {isMenuOpen
//                           ? <FaXmark className="h-6 w-6 " />
//                           : <FaBars className="h-6 w-6 " />} */}
//                       </button>
//                     </div>
//                   </div>
//                   <div
//                     className={`absolute space-y-2 z-30  right-0 mt-10 w-[200px] mb-10 rounded-l-lg text-center justify-end items-center py-3 transition-all duration-500000 ease-in-out  bg-primary bg-opacity-10  shadow-lg border-[4px] border-[white] border-opacity-50 ${isMenuOpen
//                       ? " h-auto pl-10 w-[200px] block text-center justify-center items-center hover:transition-transform hovet:text-opacity-100  hover:duration-50000 hover:ease-in-out text-opacity-0 text-[#c2c2c2] hover:text-opacity-100 hover:bg-ControllerPrim hover:border-opacity-100 mb-10"
//                       : "hidden"}`}
//                   >
//                     <ul className=" flex flex-col gap-1 relative justify-center w-full !mt-[8.00px] !text-[14px] cursor-pointer  ![font-family:'Inter',Helvetica]  items-start mb-5 ">
//                       <li key="1">
//                         <a
//                           className="flex relative transform  transition-transform w-full hover:font-bold bg-transparent  hover:text-[white]"
//                           onClick={() => handleTag("All")}
//                         >
//                           {" "}All{" "}
//                         </a>
//                       </li>
//                     </ul>
//                   </div>
//                 </div>
//                 <div className=" p-2 m-3 border-[2px] rounded border-golden">
//                 <div className="max-h-[500px] overflow-auto py-1.3 ">
//                   <table className=" w-[100%] lg:visible invisible">
//                     <thead className="flex w-full sm:no relative text-[1rem] text-[white]  bg-userBlue">
//                       <tr key="index" className="flex w-full ">
//                         <th className="flex w-[40%] border-[1px] pl-3 border-white justify-start items-center ">
//                           About Income
//                         </th>
//                         <th className="flex w-[20%] justify-start items-center pl-3 border-[1px] border-white ">
//                           Category
//                         </th>
//                         <th className="flex  w-[20%] justify-sart items-center pl-3 border-[1px] border-white">
//                           Date
//                         </th>
//                         <th className="flex  w-[20%] justify-start items-center pl-3 border-[1px] border-white">
//                           Amount
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody className="flex justify-center items-center bg-black w-full text-white flex-wrap cursor-pointer">
                      
                          
//                          <ExpenseCard/>
                      
//                     </tbody>
//                   </table>

//                   {/* {Array.isArray(showExpenses) &&
//                     (showExpenses.length !== 0
//                       ? showExpenses.map(expense =>
//                           <div
//                             key={expense.expenseID}
//                             className="flex justify-center items-center bg-black w-full text-white flex-wrap cursor-pointer"
//                             onClick={() => handleCardClick(expense)}
//                           >
//                             <ExpenseCard
//                               expenseName={"user"}
//                               note={"Paid for Grosary from Keels Supper"}
//                               category={"Grosary"}
//                               Date={"07/23/2024"}
//                               Amount={"3500.00"}
//                             />
//                           </div>
//                         )
//                       : <div className="flex justify-center items-center w-full">
//                           No Expenses available!
//                         </div>)} */}
//                 </div>
//             </div>
//           </div>
                
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Income;
