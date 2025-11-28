import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Snackbar, Alert } from '@mui/material';
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "../hooks/useAuth";
import { FaEye, FaEyeSlash } from "react-icons/fa6";

const LoginPage = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState({}); 
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [snackMessage, setSnackMessage] = useState({message: "", severity: ""});
  const videoRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    // Ensure video plays and loops properly
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.log("Video autoplay failed:", error);
      });
    }
  }, []);

  useEffect(() => {
    if(snackMessage.message !== ""){
      setOpen(true);
    }
  }, [snackMessage]);

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
      if (!fieldError[name]) {
        const { [name]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, ...fieldError };
    });
  };

  const validateForm = (name, value) => {
    const errors = {};
    switch(name){
      case "email":  
        if (!value) {
          errors.email = "Email is required";
        } else {
          const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
          const specificDomainRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com)$/;
          if (!emailRegex.test(value)) {
            errors.email = "Email is invalid";
          } else if (!specificDomainRegex.test(value)) {
            errors.email = "Only emails from gmail.com, yahoo.com, or outlook.com are allowed.";
          }
        };
        break;
      case "password":  
        if (!value) {
          errors.password = "Password is required";
        } else if (!/^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/.test(value)) {
          errors.password = "Password must be at least 6 characters long and include a special character";
        };
        break;
      default:
        break;  
    };
    return errors;
  };

  const validateFormData = formData => {
    const errors = {};

    Object.keys(formData).forEach(field => {
      const fieldErrors = validateForm(field, formData[field]);
      if (fieldErrors[field]) {
        errors[field] = fieldErrors[field];
      }
    });
    return errors;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const errors = validateFormData(formData);
    setErrors(errors);
    if (Object.keys(errors).length > 0) {
      let message = {message: "Please correct the highlighted errors.", severity: "error"};
      setSnackMessage(message);
      console.log("Validation Errors:", errors);
      return;
    }
    setLoading(true);
    try {
      const response = await login(formData);
      console.log("login jwt token : ", response);
      setSnackMessage({ message: "Login Successful!", severity: "success" });
      setTimeout(() => {
        navigate("/home");
      }, 2000);
    } catch (error) {
      console.error("Login error:", error);

      const errorMessage =
        error.response?.data?.message ||
        "Login failed! Please check your credentials.";

      setSnackMessage({ message: errorMessage, severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 z-50">
          <div className="loader ease-linear rounded-full border-8 border-t-8 border-[#4B71F0] h-16 w-16"></div>
        </div>
      )}
      
      {/* Left Side: Video Background */}
      <div className="hidden md:flex justify-center items-center w-1/2 bg-black relative overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="absolute w-full h-full object-cover"
          poster="/loginnew1.JPG"
        >
          <source src="/loginvideo2.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Dark overlay for better readability */}
        <div className="absolute inset-0 bg-black bg-opacity-40 z-10"></div>
        
        {/* Welcome text on video */}
        <div className="relative z-20 text-white text-center px-8">
          <h2 className="text-4xl font-bold mb-6">Welcome Back</h2>
          <p className="text-xl opacity-90">Sign in to access your account and continue your journey</p>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="flex w-full md:w-1/2 flex-col items-center justify-center bg-white md:px-10 py-10">
        <div className="text-center flex mb-8">
          <h1 className="font-bold text-4xl text-[#14bbb0]">Login</h1>
        </div>
        <form className="w-2/3" onSubmit={handleLogin}>
          <div className="relative my-5">
            <input
              type="email"
              value={formData.email}
              className={`peer m-0 block h-[58px] border-[1px] focus:shadow border-solid border-golden w-full rounded bg-transparent bg-clip-padding px-3 py-4 text-base font-normal text-neutral-700 placeholder:text-transparent focus:border-[#4B71F0] focus:pb-[1px] focus:pt-[1px] focus:text-neutral-700 focus:outline-none peer-focus:text-black [&:not(:placeholder-shown)]:pb-[0.625rem] [&:not(:placeholder-shown)]:pt-[1.625rem]
               ${errors.email ? "border-error" : ""}`}
              id="floatingEmail"
              name="email"
              placeholder="name@example.com"
              onChange={handleChange}
            />
            <label
              htmlFor="floatingEmail"
              className="pointer-events-none absolute left-0 top-0 origin-[0_0] border border-solid border-transparent px-3 py-4 text-neutral-500 transition-[opacity,_transform] duration-200 ease-linear peer-focus:-translate-y-2 peer-focus:translate-x-[0.15rem] peer-focus:scale-[0.85] peer-focus:text-black peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:translate-x-[0.15rem] peer-[:not(:placeholder-shown)]:scale-[0.85] motion-reduce:transition-none"
            >
              Email address
            </label>
            {errors.email && (
              <div className="text-error text-sm mt-1">{errors.email}</div>
            )}
          </div>

          <div className="relative mt-5 mb-4 sm:mb-8">
            <input
              type={passwordVisible ? "text" : "password"}
              value={formData.password}
              className={`peer m-0 block h-[58px] border-[1px] focus:shadow border-solid border-golden w-full rounded bg-transparent bg-clip-padding px-3 py-4 text-base font-normal leading-tight text-neutral-700 placeholder:text-transparent focus:border-[#4B71F0] focus:pb-[0.625rem] focus:pt-[1.625rem] focus:text-neutral-700 focus:outline-none peer-focus:text-black [&:not(:placeholder-shown)]:pb-[0.625rem] [&:not(:placeholder-shown)]:pt-[1.625rem]
                ${errors.password ? "border-error" : ""}`}
              id="floatingPassword"
              name="password"
              placeholder="Password"
              onChange={handleChange}
            />
            <label
              htmlFor="floatingPassword"
              className="pointer-events-none absolute left-0 top-0 origin-[0_0] border border-solid border-transparent px-3 py-4 text-neutral-500 transition-[opacity,_transform] duration-200 ease-linear peer-focus:-translate-y-2 peer-focus:translate-x-[0.15rem] peer-focus:scale-[0.85] peer-focus:text-black peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:translate-x-[0.15rem] peer-[:not(:placeholder-shown)]:scale-[0.85] motion-reduce:transition-none"
            >
              Password
            </label>
            <button
              type="button"
              onClick={() => setPasswordVisible(!passwordVisible)}
              className="absolute top-7 right-3 text-gray-600 hover:text-gray-800 transition-colors"
            >
              {passwordVisible ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </button>
            {errors.password && (
              <div className="text-error text-sm mt-1">{errors.password}</div>
            )}
            <p className="text-xs cursor-pointer hover:underline mt-2">
              <Link to="/forgot-password" className="text-[#14bbb0] hover:underline hover:font-semibold">
                Forgot Password?
              </Link>
            </p>
          </div>

          <button
            type="submit"
            className="my-2 block w-full rounded bg-[#4B71F0] hover:bg-[#3e67f0] sm:px-6 px-3 pb-2 pt-2.5 text-lg font-medium leading-normal text-white hover:shadow focus:shadow focus:outline-none focus:ring-0 active:bg-[gray] active:shadow transition duration-150 ease-in-out transform hover:scale-[1.02]"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
          
          <h4 className="text-center my-4 font-semibold text-gray-600">Or</h4>

          <button 
            type="button"
            className="lg:px-4 px-2 py-2 my-2 md:my-5 border flex items-center justify-center gap-2 w-full rounded-md text-slate-700 hover:border-[#14bbb0] border-goldenHover hover:text-slate-900 hover:shadow transition duration-150 ease-in-out"
          >
            <FcGoogle className="w-5 h-5" />
            <span>Login with Google</span>
          </button>
          
          <div className="flex md:gap-3 gap-1 justify-center mt-4">
            <p className="text-sm text-gray-600">Still not registered?</p>
            <p className="text-md hover:underline text-[#14bbb0] font-semibold hover:shadow">
              <Link to="/register">Register</Link>
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
          >
            {snackMessage.message}
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
};

export default LoginPage;

