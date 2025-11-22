import React, { useState} from "react";
import { ExpenseCard } from "./ExpenseCard";
import { Tag } from "antd";
//import { FaBars, FaXmark } from 'react-icons/fa';



const Expense = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const handleTag = (tag) => {
    console.log('Tag clicked:', tag);
  };
  
  const showExpenses = () => {
  };
  
  const handleCardClick = (card) => {
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-7 bg-expenseBC py-3">
      <div className=" py-2 lg:col-span-3"  >
        <div className=" ">
          <form className="bg-red-50 border-[3px] border-golden shadow-lg rounded-[20px] m-5 text-gray-900  font-semibold text-base">
            <div className="flex flex-col p-5 ">
                <div className=" flex w-full h-80 shadow-md justify-end rounded-t-[20px] opacity-90 items-end bg-credit-card bg-cover bg-center">
                    <h1 className="flex shadow-md justify-between bg-expenseBC font-bold px-5 py-3 w-full ">
                        <span className="text-2xl md:text-2xl text-black  ">
                            Enter Your Expenses
                        </span>
                        <button className=" py-1  px-5 border-[2px] border-golden shadow-sm hover:shadow-golden hover:shadow-md  rounded">Add</button>
                    </h1>
                </div>
                <div className="flex flex-col gap-2  mx-5 mt-5">
                  <div className="flex relative flex-row items-center justify-start  px-3">
                    <label className="block mx-1 my-2 w-[20%] ">
                      Expense Name
                    </label>
                    <input
                      type="text"
                      id="incomeName"
                      className="block p-2.5 mx-3 w-[60%] text-gray-600 bg-gray-100 focus:bg-white focus:border-expenseBC hover:bg-white text-sm rounded-lg border-b-4 border-expenseBC border-[1px]"
                    >
                      {/* {incomeName} */}
                    </input>
                  </div>
                  <div className="flex relative flex-row items-center justify-start px-3">
                    <label className="block mx-1 w-[20%] my-2 ">Date</label>
                    <input
                      type="date"
                      id="date"
                      className="block p-2.5 w-[40%] mx-3 border-b-4 text-sm text-gray-600 bg-gray-100 focus:bg-white hover:bg-white rounded-lg border-expenseBC border-[1px]"
                    >
                      {/* {" "}{date} */}
                    </input>
                  </div>
                  <div className="flex relative flex-row items-center justify-start px-3">
                    <label className="block mx-1 w-[20%] my-2 ">Amount</label>
                    <input
                      type="number"
                      id="amount"
                      className="block p-2.5 w-[40%] mx-3 border-b-4  text-sm text-gray-600 bg-gray-100 focus:bg-white hover:bg-white rounded-lg border-expenseBC border-[1px]"
                    >
                      {/* {" "}{amount} */}
                    </input>
                  </div>
                  <div className="flex relative flex-row items-center justify-start px-3">
                    <label className="block mx-1 my-2 w-[20%]">Category</label>
                    <select className="block p-2.5 mx-3 border-b-4 w-[60%] text-sm text-gray-600 bg-gray-100 focus:bg-white hover:bg-white rounded-lg border-expenseBC border-[1px]">
                        <option>None</option>
                      <option>Housing</option>
                      <option>Transportation</option>
                      <option>Education</option>
                      <option>Food</option>
                    </select>

                    {/* {" "}{category} */}
                  </div>
                  <div className="flex relative flex-row items-center justify-start px-3">
                    <label className="block mx-1 my-2 w-[20%]">Note</label>
                    <textarea
                      type="textarea"
                      id="Note"
                      className="block p-2.5 w-[60%] mx-3 border-b-4 text-sm text-gray-600 bg-gray-100 focus:bg-white hover:bg-white rounded-lg border-expenseBC border-[1px]"
                    >
                      {/* {" "}{note} */}
                    </textarea>
                  </div>
                </div>
                
              </div>
          </form>
        </div>
      </div>
      <div className="bg-bgExpenses bg-cover rounded-l-[20px] lg:col-span-4 py-2">
        <div className=" w-full h-full ">
        <div>
                <div>
                  <div>
                    <div className="md:flex hidden flex-row justify-center items-center my-3 mx-10 text-black font-semibold">
                      <Tag className=" w-full h-8 bg-golden hover:bg-yellow-600 focus:bg-slate-600 text-[1rem] text-center  m-1 p-1 shadow-2xl cursor-pointer">
                        All{" "}
                      </Tag>
                      <Tag className=" w-full h-8 bg-golden hover:bg-yellow-600 focus:bg-slate-600 text-[1rem] text-center  m-1 p-1 shadow-2xl cursor-pointer">
                        Housing{" "}
                      </Tag>
                      <Tag className=" w-full h-8 bg-golden hover:bg-yellow-600 focus:bg-slate-600 text-[1rem] text-center m-1 p-1 shadow-2xl cursor-pointer">
                        Transportation{" "}
                      </Tag>
                      <Tag className=" w-full h-8 bg-golden hover:bg-yellow-600 focus:bg-slate-600 text-[1rem] text-center m-1 p-1 shadow-2xl cursor-pointer">
                        Healthcare{" "}
                      </Tag>
                      <Tag className=" w-full h-8 bg-golden hover:bg-yellow-600 focus:bg-slate-600 text-[1rem] text-center m-1 p-1 shadow-2xl cursor-pointer">
                        Food{" "}
                      </Tag>
                    </div>
                    <div className="flex md:hidden w-full items-center justify-end  ">
                      <button
                        onClick={toggleMenu}
                        className="text-black focus:outline-none justify-end m-4 focus:test-gray-500  "
                      >
                        {/* {isMenuOpen
                          ? <FaXmark className="h-6 w-6 " />
                          : <FaBars className="h-6 w-6 " />} */}
                      </button>
                    </div>
                  </div>
                  <div
                    className={`absolute space-y-2 z-30  right-0 mt-10 w-[200px] mb-10 rounded-l-lg text-center justify-end items-center py-3 transition-all duration-500000 ease-in-out  bg-primary bg-opacity-10  shadow-lg border-[4px] border-[white] border-opacity-50 ${isMenuOpen
                      ? " h-auto pl-10 w-[200px] block text-center justify-center items-center hover:transition-transform hovet:text-opacity-100  hover:duration-50000 hover:ease-in-out text-opacity-0 text-[#c2c2c2] hover:text-opacity-100 hover:bg-ControllerPrim hover:border-opacity-100 mb-10"
                      : "hidden"}`}
                  >
                    <ul className=" flex flex-col gap-1 relative justify-center w-full !mt-[8.00px] !text-[14px] cursor-pointer  ![font-family:'Inter',Helvetica]  items-start mb-5 ">
                      <li key="1">
                        <a
                          className="flex relative transform  transition-transform w-full hover:font-bold bg-transparent  hover:text-[white]"
                          onClick={() => handleTag("All")}
                        >
                          {" "}All{" "}
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className=" p-2 m-3 border-[2px] rounded border-golden">
                <div className="max-h-[500px] overflow-auto py-1.3 bg-expenseBC ">
                  <table className=" w-[100%] lg:visible invisible">
                    <thead className="flex w-full sm:no relative text-[1rem] text-[white]  bg-userBlue">
                      <tr key="index" className="flex w-full ">
                        <th className="flex w-[40%] border-[1px] pl-3 border-white justify-start items-center ">
                          About Expense
                        </th>
                        <th className="flex w-[15%] justify-start items-center pl-3 border-[1px] border-white ">
                          Category
                        </th>
                        <th className="flex  w-[15%] justify-sart items-center pl-3 border-[1px] border-white">
                          Date
                        </th>
                        <th className="flex  w-[15%] justify-start items-center pl-3 border-[1px] border-l-[1px] border-white">
                          Amount
                        </th>
                        <th className="flex  w-[15%] justify-start items-center pl-3 border-[1px] border-white">
                          
                        </th>
                      </tr>
                    </thead>
                    <tbody className="flex justify-center items-center bg-black w-full text-white flex-wrap cursor-pointer">
                      
                          
                         <ExpenseCard/>
                      
                    </tbody>
                  </table>

                  {/* {Array.isArray(showExpenses) &&
                    (showExpenses.length !== 0
                      ? showExpenses.map(expense =>
                          <div
                            key={expense.expenseID}
                            className="flex justify-center items-center bg-black w-full text-white flex-wrap cursor-pointer"
                            onClick={() => handleCardClick(expense)}
                          >
                            <ExpenseCard
                              expenseName={"user"}
                              note={"Paid for Grosary from Keels Supper"}
                              category={"Grosary"}
                              Date={"07/23/2024"}
                              Amount={"3500.00"}
                            />
                          </div>
                        )
                      : <div className="flex justify-center items-center w-full">
                          No Expenses available!
                        </div>)} */}
                </div>
            </div>
          </div>
                
        </div>
      </div>
    </div>
  );
};

export default Expense;







// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



// <div className="bg-back w-full max-h-[100%] lg:h-screen lg:w-screen bg-cover">
// <div className=" flex relative justify-center items-stretch min-h-screen w-full">
//   <div className="lg:flex flex-col lg:fixed lg:z-50 justify-center left-0 items-center w-full lg:w-[20%] h-screen bg-expenseBC">
//     <div className="flex lg:flex items-center justify-between py-3 px-3 w-full lg:h-[10%]">
//       <div className="flex text-xs">
//         <img src="/logo2.png" alt="" className="text-xs h-14" />
//       </div>
//       <div className="flex relative p-1 items-center">
//         <PopupState variant="popover" popupId="demo-popup-menu">
//           {(popupState) => (
//             <>
//               <Button
//                 variant="contained"
//                 {...bindTrigger(popupState)}
//                 style={{
//                   backgroundColor: '#00DDA2',
//                   color: '#FFFFF',
//                   boxShadow: "#B5C6C5",
//                   padding: "1px 5px",
//                   fontWeight: "bold",
//                   textTransform: "none",
//                 }}
//               >
//                 Hello!&nbsp;<span className="text-[#334050] text-xs">{userName}</span>
//               </Button>
//               <Menu {...bindMenu(popupState)}>
//                 <MenuItem onClick={popupState.close}>Themes</MenuItem>
//                 <MenuItem onClick={handleLogout}>Logout</MenuItem>
//               </Menu>
//             </>
//           )}
//         </PopupState>
//       </div>
//     </div>
//     <div className="w-full h-[90%] flex flex-col items-center justify-center">
//       <div className="lg:hidden pt-5 w-full flex">
//         <Dashboard
//           startingDate={startingDate}
//           endingDate={endingDate}
//           databaseUpdate={handleDatabaseUpdate}
//         />
//       </div>

//       <div className="w-full relative pt-10 flex flex-col justify-center items-center">
//         {startingDate && endingDate && (
//           <div className="pb-2 income w-full">
//             <p className="font-bold">
//               Date Range: <span className="text-sm text-white font-light">{startingDate ? startingDate.toLocaleDateString() : 'Not selected'}</span>
//               <span className="text-sm text-white font-light"> - {endingDate ? endingDate.toLocaleDateString() : 'Not selected'}</span>
//             </p>
//           </div>
//         )}
//         <div className="relative w-full flex items-center justify-center">
//           <DatePicker
//             selected={startingDate}
//             onChange={(update) => {
//               const [start, end] = update;
//               setStartingDate(start);
//               setEndingDate(end);
//             }}
//             startDate={startingDate}
//             endDate={endingDate}
//             selectsRange
//             inline
//             placeholderText="Select a date range"
//             dayClassName={(date) => {
//               if (startingDate && endingDate && date >= startingDate && date <= endingDate) {
//                 return "custom-day custom-day--in-range";
//               }
//               if (date === startingDate || date === endingDate) {
//                 return "custom-day custom-day--selected";
//               }
//               return "custom-day";
//             }}
//             popperClassName="custom-popper"
//           />
//         </div>
//       </div>

//       <div className="relative lg:flex hidden lg:col-span-2 w-full">
//         <div className="md:flex md:flex-col grid grid-cols-2 w-full md:gap-3 p-5 gap-2 items-center justify-center">
//           <div
//             data-animation="left"
//             className="flex bg-incomeBC w-full md:h-32 justify-center p-5 cursor-pointer items-center rounded-lg text-[2rem] text-center hover:bg-incomeHover shadow-[0_4px_9px_-4px_#9e9e9e] transition duration-150 ease-in-out"
//             onClick={handleIncomeCard}
//           >
//             Income
//           </div>
//           <div
//             data-animation="right"
//             className="flex bg-expenseBC w-full md:h-32 justify-center p-5 cursor-pointer items-center rounded-lg text-[2rem] text-white text-center hover:bg-expenseHover shadow-[0_4px_9px_-4px_#9e9e9e] transition duration-150 ease-in-out"
//             onClick={handleExpenseCard}
//           >
//             Expense
//           </div>
//         </div>
//       </div>
//      </div>
//   </div>

  
//   <div className="w-full flex px-5 lg:px-0 ">
//   <div className="lg:w-[20%] w-0 "></div>
//   <div className="lg:w-[80%] w-full py-5 flex flex-col items-center justify-center h-auto">
//     <div className="hidden lg:flex w-full">
//       <Dashboard startingDate={startingDate} endingDate={endingDate} databaseUpdate = {handleDatabaseUpdate}/>
//     </div>
//     <div className=" relative flex lg:hidden  ">
//         <div className=" w-full rounded-lg gap-3 runded-xl">
//           <div className="flex px-2 py-5 md:gap-3 gap-2 items-center justify-center ">
//             <div data-animation = "left"
//               className="flex opacity-100 bg-incomeBC transform-translateX(0%) w-full md:h-32 justify-center p-5 cursor-pointer items-center rounded-lg text-[2rem] text-center hover:bg-incomeHover focus:bg-focusColor focus:test-gray-500 shadow-[0_4px_9px_-4px_#9e9e9e] hover:shadow-[0_8px_9px_-4px_#9e9e9e,0_4px_18px_0_#7e7d7d] focus:shadow-[0_8px_9px_-4px_#9e9e9e,0_4px_18px_0_#7e7d7d] focus:outline-none focus:ring-0 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] transition duration-150 ease-in-out "
//               onClick={e => handleIncomeCard()}
//             >
//               Income
//             </div>
//             <div data-animation = "right"
//               className=" flex opacity-100 bg-expenseBC transform-translateX(0%) w-full md:h-32 cursor-pointer p-5 rounded-lg text-[2rem] text-white text-center justify-center items-center hover:bg-expenseHover focus:test-gray-500 focus:bg-gray-transparent shadow-[0_4px_9px_-4px_#9e9e9e] hover:shadow-[0_8px_9px_-4px_#9e9e9e,0_4px_18px_0_#7e7d7d] focus:shadow-[0_8px_9px_-4px_#9e9e9e,0_4px_18px_0_#7e7d7d] focus:outline-none focus:ring-0 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] transition duration-150 ease-in-out "
//               onClick={e => handleExpenseCard()}
//             >
//               Expense
//             </div>
//           </div>
//         </div>
//     </div>
    
//     <div id="transactionPage" ref={transactionPageRef}>
//       <TransactionPage  startingDate={startingDate} endingDate={endingDate} databaseUpdate={handleDatabaseUpdate} 
//        popupSelection={handlePopupSelection} onMaximizeToggle={handleMaximizeToggle} maxStatus={isMaximized}/>
//     </div>
//   </div>
//   </div>
// </div>
// {isPopupWindowOpened && (
//   <div className="fixed cursor-pointer z-50 top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-80">
//     <div className=" h-[25%] rounded-lg shadow-lg w-2/5 relative">
//       <div className="relative flex">
//         <TransactionForm type={popupType} Selection={popupSelection} onClose={closePopupWindow} onAddEdit={() =>{handleTransactionAddEdit()}} />
//       </div>
//     </div>
//   </div>
// )}
// {isMaximized && (
//   <div className="popup-container">
//     <div className="fixed cursor-pointer z-50 top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-80">
//       <div className="py-10 px-10 my-10 h-full rounded-lg shadow-lg w-full relative">
//         <div className="relative ">
          
//           <TransactionPage
//             startingDate={startingDate}
//             endingDate={endingDate}
//             databaseUpdate={handleDatabaseUpdate}
//             popupSelection={handlePopupSelection}
//             onMaximizeToggle={handleMaximizeToggle}
//             maxStatus={isMaximized}
//           />
//         </div>
//       </div>
//     </div>
//   </div>
// )}
// </div>

// export default HomePage;

