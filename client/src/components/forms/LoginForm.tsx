import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../stores";
import { loginUser } from "../../slices/authSlice";
import { useNavigate } from "react-router-dom";
import "../../style/LoginForm.css";

type FormData = {
  email: string;
  password: string;
};

const schema = yup.object().shape({
  email: yup
    .string()
    .email("invalid email")
    .matches(/^[\w.+-]+@gmail\.com$/, "please re-enter your email")
    .required("email is required"),
  password: yup.string().required("password is required"),
});

export default function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: yupResolver(schema) });
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { currentUser, error, loading } = useSelector((state: RootState) => state.auth);

  React.useEffect(() => {
    if (currentUser) navigate("/");
  }, [currentUser, navigate]);

  const onSubmit = (data: FormData) => {
    dispatch(loginUser(data));
  };

  return (
    <div className="login-root">
      <header className="header">
        <div className="header-logo">VocabApp</div>
        <div className="header-actions">
          <a href="/login" className="btn btn-login">Login</a>
          <a href="/register" className="btn btn-register">Register</a>
        </div>
      </header>
      <div className="login-container">
        <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
          <h2 className="login-title">Login</h2>
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
          {error && <div className="error">{error}</div>}
          <button className="btn btn-login-main" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}