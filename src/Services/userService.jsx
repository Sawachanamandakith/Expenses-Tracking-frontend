import axios from "axios";

axios.defaults.baseURL = 'https://expensebackend.dockyardsoftware.com';

export const registration = async (userData) => {
    console.log("Sending register data:", userData);
    try {
        const { data } = await axios.post('/User/Register', userData);
        console.log("User is created", data);
        return data;
    } catch (error) {
        console.error("Error adding user:", error.response ? error.response.data : error.message);
        throw error;
    }
}

export const loginTo = async (userData) => {
    console.log("Sending login data:", userData);
    try {
        const { data } = await axios.post('/User/Login', userData);
        console.log("login API response:", data);

        if (data.StatusCode === 200) {
             
            const resultObj = JSON.parse(data.Result);
            
            
            localStorage.setItem("UserID", resultObj.UserID);
            
            console.log("UserID stored in localStorage:", resultObj.UserID);
            return resultObj;
        } else {
            throw new Error("Login failed");
        }
    } catch (error) {
        if (error.response && error.response.status === 400) {
            throw new Error("Email or password incorrect");
        } else {
            console.error("Error checking login:", error.response ? error.response.data : error.message);
            throw error;
        }
    }
};

export const sendPasswordResetEmail = async (email) => {
    console.log("Sending password reset email to:", email);
    try {
        const { data } = await axios.post('/User/ForgotPassword', { Email: email });
        console.log("New password sent", data);
        return data;
    } catch (error) {
        if (error.response && error.response.status === 400) {
            throw new Error("Email is incorrect");
        } else {
            console.error("Error in sending email:", error.response ? error.response.data : error.message);
            throw error;
        }
    }
}

export const resetNewPassword = async (token, password) => {
    try {
        const { data } = await axios.post('/User/ResetPassword', { 
            ResetPasswordToken: token, 
            Password: password 
        });
        console.log("Sent new password", data);
        return data;
    } catch (error) {
        console.error("Error in resetting password:", error.response ? error.response.data : error.message);
        throw error; 
    }
}
