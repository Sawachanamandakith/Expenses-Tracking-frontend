import React, { useEffect, useState } from "react";
import { sendPasswordResetEmail } from "../Services/userService";
import { Snackbar, Alert } from "@mui/material";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [snackMessage, setSnackMessage] = useState({
    message: "",
    severity: ""
  });
  const [open, setOpen] = useState(false);
  const [isLinkSent, setIsLinkSent] = useState(false);

  const validate = () => {
    const errors = {};

    if (!email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Email is invalid";
    }
    return errors;
  };

  const handleForgotPassword = async e => {
    e.preventDefault();
    const validationErros = validate();
    if (Object.keys(validationErros).length === 0) {
      setLoading(true);
      try {
        await sendPasswordResetEmail(email);
        const message = {
          message: "Password reset link sent to your email! ",
          severity: "success"
        };
        setSnackMessage(message);
        setTimeout(() => {
          setLoading(false);
          setIsLinkSent(true);
        }, 2000);
      } catch (error) {
        setLoading(false);
        setSnackMessage({
          message: "Failed to send reset link. Please try again.",
          severity: "error"
        });
      }
    } else {
      setErrors(validationErros);
    }
  };

  useEffect(
    () => {
      if (snackMessage.message !== "") {
        setOpen(true);
      }
    },
    [snackMessage]
  );
  useEffect(() => {
    return () => {
      setIsLinkSent(false);
    };
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="container mx-auto p-5 pt-20 mt-20 md:p-0">
      {loading &&
        <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 z-50">
          <div className="loader ease-linear rounded-full border-8 border-t-8 h-16 w-16" />
        </div>}
      <div className="max-w-sm mx-auto bg-white px-10 py-10 rounded-2xl border shadow">
        <div className="text-center mb-8">
          <h1 className="font-bold text-xl text-[#14bbb0]">Forgot Password</h1>
        </div>
        {isLinkSent?  <p className="text-sm font-sans">You will recieved a password reset email soon.<br/> Follow the link in the email to reset the password.</p>
        : 
        <div>
          <p className="text-sm font-sans">Enter your email address and we'll send you a password reset link.</p>
          <form onSubmit={handleForgotPassword}>
            <div className="relative mt-5 mb-8">
              <input
                type="email"
                value={email}
                className={`peer m-0 block h-[58px] w-full rounded border-[1px] focus:shadow border-solid border-golden focus:border-[#3e67f0] bg-transparent bg-clip-padding px-3 py-4 text-base font-normal leading-tight text-neutral-700 placeholder:text-transparent focus:pb-[0.625rem] focus:pt-[1.625rem] focus:text-neutral-700 focus:outline-none peer-focus:text-black [&:not(:placeholder-shown)]:pb-[0.625rem] [&:not(:placeholder-shown)]:pt-[1.625rem]
                  ${errors.email ? "border-error" : ""}`}
                id="forgotEmail"
                placeholder="name@example.com"
                onChange={e => setEmail(e.target.value)}
                required
              />
              <label
                htmlFor="forgotEmail"
                className="pointer-events-none absolute left-0 top-0 origin-[0_0] border border-solid border-transparent px-3 py-4 text-neutral-500 transition-[opacity,_transform] duration-200 ease-linear peer-focus:-translate-y-2 peer-focus:translate-x-[0.15rem] peer-focus:scale-[0.85] peer-focus:text-black peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:translate-x-[0.15rem] peer-[:not(:placeholder-shown)]:scale-[0.85] motion-reduce:transition-none"
              >
                Email address
              </label>
              {errors.email &&
                <div className="text-error text-sm">
                  {errors.email}
                </div>}
            </div>
            <button
              type="submit"
              className=" mx-auto w-full block py-2 rounded bg-[#4B71F0] hover:bg-[#3e67f0] focus:bg-goldenHover px-6 pb-2 pt-2.5 text-lg font-medium leading-normal text-white hover:shadow focus:shadow focus:outline-none focus:ring-0 active:bg-[gray] active:shadow"
            >
              Send Reset Link
            </button>
          </form>
        </div> }
        
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          open={open}
          onClose={handleClose}
          autoHideDuration={3000}
        >
          <Alert
            onClose={handleClose}
            severity={snackMessage.severity}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {snackMessage.message}
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
};

export default ForgotPassword;
