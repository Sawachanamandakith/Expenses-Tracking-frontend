import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { message,Select } from "antd";
import { Snackbar, Alert } from '@mui/material';
import { registration } from "../Services/userService";
import { FaEye, FaEyeSlash } from "react-icons/fa6";

const Registration = () => {
  // const { Option } = Select;
  const [userName, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formData, setFormData] = useState({
    userName:"",
    email:"",
    password:""
  })
  // const [prefferedSequence, setPrefferedSequence] = useState("");
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [snackMessage, setSnackMessage] = useState({message:"", severity:""});

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: ""
    }));
    setFormData({
      ...formData,
      [name]: value
    });

    const fieldError = validateForm(name, value);

    setErrors(prev => {
      // If no error for this field, remove it from the errors object
      if (!fieldError[name]) {
        const { [name]: _, ...rest } = prev; // Exclude the current field's error
        return rest;
      }
      // Otherwise, update the error for this field
      return { ...prev, ...fieldError };
    });
  };


  const validateForm = (name, value) => {
    const errors = {};
    switch(name){
      case "userName":
        if (!name) {
          errors.userName = "User Name is required";
        } else if (value.length < 4 || value.length > 20) {
          errors.userName = "Username must be between 4 and 20 characters.";
        } else if (!/^[a-zA-Z0-9_-]+$/.test(value)) {
          errors.userName = "Username can only contain letters, numbers, underscores, and hyphens.";
        };
        break;
      case "email":  
        if (!name) {
          errors.email = "Email is required";
        } else {
          const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // General email syntax
          const specificDomainRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com)$/; // Specific domains
          if (!emailRegex.test(value)) {
            errors.email = "Email is invalid";
          } else if (!specificDomainRegex.test(value)) {
            errors.email = "Only emails from gmail.com, yahoo.com, or outlook.com are allowed.";
          }
        };
        break;
      case "password":  
        if (!name) {
          errors.password = "Password is required";
        } else if (!/^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/.test(value)) {
          errors.password = "Password must be at least 6 characters long and include a special character";
        };
        break;
      default:
        break;  
    };
    // if (!prefferedSequence) {
    //   errors.prefferedSequence = "Preferred Sequence is required";
    // }
  
    return errors;
  };

  const validateFormData = formData => {
    const errors = {};

    // Validate top-level fields
    Object.keys(formData).forEach(field => {
      const fieldErrors = validateForm(field, formData[field]);
      if (fieldErrors[field]) {
        errors[field] = fieldErrors[field];
      }
    });
    return errors;
  };

  const handleRegister = async e => {
    e.preventDefault();
    const errors = validateFormData(formData);
    setErrors(errors);
    if (Object.keys(errors).length > 0) {
      let message = {message:"Please correct the highlighted errors.", severity:"error"};
      setSnackMessage(message);
      console.log("Validation Errors:", errors);
      return;
    };
    setLoading(true);
    try {
      const response = await registration(formData);
      console.log("jwt token response:",response);
      localStorage.setItem("user", JSON.stringify(response));
      setSnackMessage({ message: "User successfully registered", severity: "success" });
      setName("");
      setEmail("");
      setPassword("");
      setLoading(false);
      //setPrefferedSequence("");
      setTimeout(() => {
        setLoading(false);
        window.location.href = "/";
        //navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("System error:", error);

      // Extract and display error message
      const errorMessage =
        error.response?.data?.message || // API-provided error message
        "System Error"; // Default fallback message

      setSnackMessage({ message: errorMessage, severity: "error" });
    }
  };
  useEffect(() => {
    if(snackMessage.message !== ""){
      setOpen(true);
    }
  },[snackMessage]);

  return (
    <div className="flex h-screen">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 z-50">
          <div className="loader ease-linear rounded-full border-8 border-t-8 border-[#4B71F0] h-16 w-16"></div>
        </div>
      )}
      {/* Left Side: Image */}
      <div className="hidden md:flex w-1/2 items-center justify-center bg-cover bg-center">
        {/* Optionally, you can add text or overlay styles here */}
        <div className=" w-full h-3/4 bg-cover bg-center" style={{ backgroundImage: "url('registrationNew.JPG')" }}></div>
      </div>

      {/* Right Side: Form */}
      <div className="flex w-full md:w-1/2 flex-col items-center justify-center bg-white px-10 py-10 rounded-2xl ">
        <div className="text-center mb-8">
          <h1 className="font-bold text-3xl text-[#EF854B]">Registration</h1>
        </div>
        <form className=" w-2/3">
          <div className="relative my-5">
            <input
              type="text"
              value={formData.userName}
              className={`peer m-0 block h-[58px] w-full rounded border-[1px] focus:shadow border-solid border-golden focus:border-[#4B71F0] bg-transparent bg-clip-padding px-3 py-4 text-base font-normal leading-tight text-neutral-700 placeholder:text-transparent focus:pb-[0.625rem] focus:pt-[1.625rem] focus:text-neutral-700 focus:outline-none peer-focus:text-black [&:not(:placeholder-shown)]:pb-[0.625rem] [&:not(:placeholder-shown)]:pt-[1.625rem]
                ${errors.userName ? "border-error" : ""}
              `}
              id="exampleFormControlInputText"
              name="userName"
              placeholder="Example label"
              onChange={handleChange}
              required
            />
            <label
              htmlFor="exampleFormControlInputText"
              className="pointer-events-none absolute left-0 top-0 origin-[0_0] border border-solid border-transparent px-3 py-4 text-neutral-500 transition-[opacity,_transform] duration-200 ease-linear peer-focus:-translate-y-2 peer-focus:translate-x-[0.15rem] peer-focus:scale-[0.85] peer-focus:text-black peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:translate-x-[0.15rem] peer-[:not(:placeholder-shown)]:scale-[0.85] motion-reduce:transition-none"
            >
              User Name
            </label>
            {errors.userName &&
              <div className="text-error text-sm">
                {errors.userName}
              </div>}
          </div>
          <div className="relative my-5">
            <input
              type="email"
              value={formData.email}
              className={`peer m-0 border-[1px] focus:shadow border-solid border-golden block h-[58px] w-full rounded bg-transparent bg-clip-padding px-3 py-4 text-base font-normal leading-tight text-neutral-700 placeholder:text-transparent focus:border-[#4B71F0] focus:pb-[0.625rem] focus:pt-[1.625rem] focus:text-neutral-700 focus:outline-none peer-focus:text-black [&:not(:placeholder-shown)]:pb-[0.625rem] [&:not(:placeholder-shown)]:pt-[1.625rem]
               ${errors.email ? "border-error" : ""} `}
              id="floatingInput"
              name="email"
              placeholder="name@example.com"
              onChange={handleChange}
              required
            />
            <label
              htmlFor="floatingInput"
              className="pointer-events-none absolute left-0 top-0 origin-[0_0] border border-solid border-transparent px-3 py-4 text-neutral-500 transition-[opacity,_transform] duration-200 ease-linear peer-focus:-translate-y-2 peer-focus:translate-x-[0.15rem] peer-focus:scale-[0.85] peer-focus:text-black peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:translate-x-[0.15rem] peer-[:not(:placeholder-shown)]:scale-[0.85] motion-reduce:transition-none "
            >
              Email address
            </label>
            {errors.email &&
              <div className="text-error text-sm">
                {errors.email}
              </div>}
          </div>

          <div className="relative mt-5">
            <input
              type={passwordVisible? "text": "password"}
              value={formData.password}
              className={`peer m-0 block h-[58px] w-full border-[1px] border-golden rounded border-solid bg-transparent bg-clip-padding px-3 py-4 text-base font-normal leading-tight text-neutral-700 transition duration-200 ease-linear placeholder:text-transparent focus:border-[#4B71F0] focus:pb-[0.625rem] focus:pt-[1.625rem] focus:text-neutral-700 focus:shadow focus:outline-none peer-focus:text-black [&:not(:placeholder-shown)]:pb-[0.625rem] [&:not(:placeholder-shown)]:pt-[1.625rem]
                ${errors.password ? "border-error" : ""}`}
              id="floatingPassword"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
            />
            <label
              htmlFor="floatingPassword"
              className="pointer-events-none absolute left-0 top-0 origin-[0_0] border border-solid border-transparent px-3 py-4 text-neutral-500 transition-[opacity,_transform] duration-200 ease-linear  peer-focus:-translate-y-2 peer-focus:translate-x-[0.15rem] peer-focus:scale-[0.85] peer-focus:text-primary peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:translate-x-[0.15rem] peer-[:not(:placeholder-shown)]:scale-[0.85] motion-reduce:transition-none "
            >
              Password
            </label>
            <button
                type="button"
                onClick={()=>setPasswordVisible(!passwordVisible)}
                className="absolute top-7 right-3 text-gray-600"
              >
                {passwordVisible ? <FaEyeSlash /> : <FaEye />}
              </button>
            {errors.password &&
              <div className="text-error text-sm">
                {errors.password}
              </div>}
          </div>

          <button
            onClick={handleRegister}
            type="button"
            className="my-4 block w-full rounded bg-[#4B71F0] hover:bg-[#3e67f0] focus:bg-goldenHover px-6 pb-2 pt-2.5 text-lg font-medium  leading-normal text-white
             hover:shadow focus:shadow focus:outline-none focus:ring-0 active:bg-[gray] active:shadow"
          >
            Sign Up
          </button>

          <div className="flex gap-3 px-1">
            <p className="justify-start text-sm">Already have an account?</p>
            <p className="items-end text-md hover:underline text-[#EF854B] font-semibold hover:shadow">
              <Link to="/">Login</Link>
            </p>
          </div>
        </form>
         <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={open}
          onClose={handleClose}
          autoHideDuration={1800}
        >
          <Alert
            onClose={handleClose}
            severity={snackMessage.severity}
            variant="filled"
            sx={{ width: '100%' }}
          >{snackMessage.message}
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
};
export default Registration;



