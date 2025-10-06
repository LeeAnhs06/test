import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../stores";
import { registerUser } from "../../slices/authSlice";
import { useNavigate } from "react-router-dom";
import "../../style/RegisterForm.css";

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const schema = yup.object().shape({
  firstName: yup.string().required("first name is required"),
  lastName: yup.string().required("last name is required"),
  email: yup.string().email("invalid email").matches(/^[\w.+-]+@gmail\.com$/, "please re-enter your email").required("email is required"),
  password: yup.string().min(8, "password must be at least 8 characters").required("password is required"),
  confirmPassword: yup.string()
    .oneOf([yup.ref("password")], "passwords do not match")
    .required("confirm password is required"),
});

export default function RegisterForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: yupResolver(schema) });
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error, success } = useSelector((state: RootState) => state.auth);

  React.useEffect(() => {
    if (success) navigate("/");
  }, [success, navigate]);

  const onSubmit = (data: FormData) => {
    dispatch(registerUser({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password
    }));
  };

  return (
    <div className="register-root">
      <header className="header">
        <div className="header-logo">VocabApp</div>
        <div className="header-actions">
          <a href="/login" className="btn btn-login">Login</a>
          <a href="/register" className="btn btn-register">Register</a>
        </div>
      </header>
      <div className="register-container">
        <form className="register-form" onSubmit={handleSubmit(onSubmit)}>
          <h2 className="register-title">Register</h2>
          <div className="form-group">
            <label>First Name</label>
            <input placeholder="Enter your first name" {...register("firstName")} />
            {errors.firstName && <span className="error">{errors.firstName.message}</span>}
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input placeholder="Enter your last name" {...register("lastName")} />
            {errors.lastName && <span className="error">{errors.lastName.message}</span>}
          </div>
          <div className="form-group">
            <label>Email</label>
            <input placeholder="Enter your email" {...register("email")} />
            {errors.email && <span className="error">{errors.email.message}</span>}
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="Enter your password" {...register("password")} />
            {errors.password && <span className="error">{errors.password.message}</span>}
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input type="password" placeholder="Confirm your password" {...register("confirmPassword")} />
            {errors.confirmPassword && <span className="error">{errors.confirmPassword.message}</span>}
          </div>
          {error && <div className="error">{error}</div>}
          <button className="btn btn-register-main" type="submit" disabled={loading}>
            Register
          </button>
        </form>
      </div>
    </div>
  );
}