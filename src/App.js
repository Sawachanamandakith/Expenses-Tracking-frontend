import React from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import HomePage from "./components/HomePage";
import LoginPage from "./components/LoginPage";
import TransactionForm from "./components/common/transactionForm";
import Registration from "./components/RegistrationPage";
import PrivateRoute from "./components/common/PrivateRoute";
import ForgotPassword from "./components/ForgotPassword";
import { ResetPasswordPage } from "./components/ResetPasswordPage";
import TransactionPage from "./components/transactionPage";
import PlanningPage from "./components/PlanningPage";
import WishListPage from "./components/WishListPage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path= "/" element={<LoginPage/>}/>
          <Route path="/forgot-password" element={<ForgotPassword/>}/>
          <Route path= "/reset-password/:token" element={<ResetPasswordPage/>}/>
          <Route path="/register" element={<Registration/>}/>
          <Route path="/planning" element={<PlanningPage />} />
          <Route path="/wishlist" element={<WishListPage />} />
          <Route path="/home" element={
            <PrivateRoute>
                  <HomePage/>
            </PrivateRoute>
          }/> 
           <Route path="/Form" element={
            <PrivateRoute>
                  <TransactionForm/>
            </PrivateRoute>
          }/>
          <Route
            path="/transactionPage"
            element={
              <PrivateRoute>
                <TransactionPage />
              </PrivateRoute>
            }
          /> 
        </Routes>
        
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
