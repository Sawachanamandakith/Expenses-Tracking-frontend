import { useState, createContext, useContext, useEffect } from 'react';
import { loginTo } from '../Services/userService';
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userId, setUserId] = useState(null);
    const [userName, setUserName] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
      const savedData = localStorage.getItem("token");
      const userId = localStorage.getItem("UserID");
      const userName = localStorage.getItem("userName");
      console.log("Saved user data: ", savedData);
      setLoading(true);
      if (savedData) {
        try {
          //const parsedUserData = JSON.parse(savedData);
          setIsAuthenticated(true);
          setToken(savedData);
          setUserId(userId);
          setUserName(userName);
          console.log("User restored from storage:", savedData);
        } catch (error) {
          console.error("Error parsing user data from storage:", error);
          localStorage.removeItem("token");
          setIsAuthenticated(false);
        }
      } else {
        console.log("No user data found in storage.");
        setIsAuthenticated(false);
      }
  
      setLoading(false); // Set loading to false after checking authentication
    }, []);
     
    const login = async (data) => {
      try{
        const result = await loginTo(data);
        localStorage.setItem('token', result.token);
        localStorage.setItem('userId', result.userId);
        localStorage.setItem('userName', result.userName);
        setLoading(false);
        setUserId(result.userId);
        setUserName(result.userName);
        setIsAuthenticated(true);
      }catch(error){
        console.error("Login failed:", error);
        throw error;
      }

    };

    const logout = () => {
        localStorage.removeItem('token'); 
        localStorage.removeItem('userId'); 
        localStorage.removeItem('userName'); 
        setLoading(false);
        setUserId(null);
        setUserName(null);
        setIsAuthenticated(false);
      };

    return(
        <AuthContext.Provider value={{ isAuthenticated, login, logout, userId, userName, loading}}>
            { children }
        </AuthContext.Provider>
    );    
};

export const useAuth = () => useContext(AuthContext);