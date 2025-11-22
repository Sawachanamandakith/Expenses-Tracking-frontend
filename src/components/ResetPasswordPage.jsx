import React, { useEffect, useState } from "react";
import { resetNewPassword } from "../Services/userService";
import { useNavigate, useParams } from "react-router-dom";
import { Snackbar, Alert } from "@mui/material";

export const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState();
  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState({
    message: "",
    severity: ""
  });

  const validate = () => {
    const errors = {};
    if (!password || !confirmPassword) {
      if (!password) {
        errors.password = "Password is required";
      }
      if (!confirmPassword) {
        errors.password = "confirm password is required";
      }
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    return errors;
  };

  const handleResetPassword = async e => {
    e.preventDefault();
    const validationErros = validate();
    if (Object.keys(validationErros).length === 0) {
      setLoading(true);
      try {
        await resetNewPassword(token, password);
        const message = {
          message: "Password reset successfully!",
          severity: "success"
        };
        setSnackMessage(message);
        setTimeout(() => {
          setLoading(false);
          navigate("/"); // Redirect to login page after successful reset
        }, 2000);
      } catch (error) {
        setTimeout(() => {
          setLoading(false);
        }, 2000);
        setSnackMessage({
          message: "Failed to reset the password.",
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

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="container mx-auto p-5 pt-20 mt-20 md:p-0">
      {loading &&
        <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 z-50">
          <div className="loader ease-linear rounded-full border-8 border-t-8 border-incomeBC h-16 w-16" />
        </div>}
      <div className="max-w-sm mx-auto bg-white px-10 py-10 rounded-2xl shadow-[0_8px_2px_-4px_#00DDA2,0_10px_20px_0_#334050]">
        <div className="text-center mb-8">
          <h1 className="font-bold text-xl text-[#b85f1f]">Reset Your Password</h1>
        </div>
        <p className="pt-2 pb-1 text-sm font-sans ">Enter your new password and confirm it.</p>
        <form onSubmit={handleResetPassword}>
          <div className="relative mt-1 mb-5">
            <input
              type="password"
              value={password}
              className={`peer m-0 block h-[58px] w-full rounded border-[1px] focus:shadow-md focus:shadow-incomeBC border-solid border-golden focus:border-expenseBC bg-transparent bg-clip-padding px-3 py-4 text-base font-normal leading-tight text-neutral-700 transition duration-200 ease-linear placeholder:text-transparent focus:pb-[0.625rem] focus:pt-[1.625rem] focus:text-neutral-700 focus:outline-none peer-focus:text-black [&:not(:placeholder-shown)]:pb-[0.625rem] [&:not(:placeholder-shown)]:pt-[1.625rem]
                ${errors.password ? "border-error" : ""}   `}
              id="newPassword"
              name="newPassword"
              placeholder="Password"
              onChange={e => setPassword(e.target.value)}
              required
            />
            <label
              htmlFor="newPassword"
              className="pointer-events-none absolute left-0 top-0 origin-[0_0] border border-solid border-transparent px-3 py-4 text-neutral-500 transition-[opacity,_transform] duration-200 ease-linear peer-focus:-translate-y-2 peer-focus:translate-x-[0.15rem] peer-focus:scale-[0.85] peer-focus:text-black peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:translate-x-[0.15rem] peer-[:not(:placeholder-shown)]:scale-[0.85] motion-reduce:transition-none "
            >
              New Password
            </label>
            {errors.password &&
              <div className="text-error text-sm">
                {errors.password}
              </div>}
          </div>
          <div className="relative mt-4 mb-8">
            <input
              type="password"
              value={confirmPassword}
              className={`peer m-0 block h-[58px] w-full rounded border-[1px] focus:shadow-md focus:shadow-incomeBC border-solid border-golden focus:border-expenseBC bg-transparent bg-clip-padding px-3 py-4 text-base font-normal leading-tight text-neutral-700 transition duration-200 ease-linear placeholder:text-transparent focus:pb-[0.625rem] focus:pt-[1.625rem] focus:text-neutral-700 focus:outline-none peer-focus:text-black [&:not(:placeholder-shown)]:pb-[0.625rem] [&:not(:placeholder-shown)]:pt-[1.625rem]
                  ${errors.confirmPassword ? "border-error" : ""}   `}
              id="confirmPassword"
              name="confirmPassword"
              placeholder="password"
              onChange={e => setConfirmPassword(e.target.value)}
              required
            />
            <label
              htmlFor="confirmPassword"
              className="pointer-events-none absolute left-0 top-0 origin-[0_0] border border-solid border-transparent px-3 py-4 text-neutral-500 transition-[opacity,_transform] duration-200 ease-linear peer-focus:-translate-y-2 peer-focus:translate-x-[0.15rem] peer-focus:scale-[0.85] peer-focus:text-black peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:translate-x-[0.15rem] peer-[:not(:placeholder-shown)]:scale-[0.85] motion-reduce:transition-none"
            >
              Confirm Password
            </label>
            {errors.confirmPassword &&
              <div className="text-error text-sm">
                {errors.confirmPassword}
              </div>}
          </div>
          <button
            type="submit"
            className="my-4 block w-full rounded bg-incomeBC focus:bg-goldenHover px-6 pb-2 pt-2.5 text-lg font-medium leading-normal text-white shadow-[0_4px_9px_-4px_#4D6178] transition duration-150 ease-in-out hover:shadow-[0_8px_9px_-4px_#BDCDCC,0_4px_18px_0_#B5C6C5] focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-[gray] active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]"
          >
            Reset Password
          </button>
        </form>
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          open={open}
          onClose={handleClose}
          autoHideDuration={1800}
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
