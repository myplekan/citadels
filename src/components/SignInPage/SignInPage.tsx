import { useState } from "react";

import "./SignInPage.css";
import { Link } from "react-router-dom";

export const SignInPage = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [isRemember, setIsRemember] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
  };

  const handleReset = () => {
    setLogin("");
    setPassword("");
    setIsRemember("");
  };

  return (
    <div className="sing-in">
      <h1 className="sing-in__title">Sign in</h1>

      <form
        className="sing-in__form"
        action=""
        method="POST"
        onSubmit={handleSubmit}
      >
        <label className="sing-in__form-label" htmlFor="login">
          Login:
          <input
            id="login"
            type="email"
            value={login}
            placeholder="Enter you email"
            onChange={(e) => setLogin(e.target.value)}
          />
        </label>

        <label className="sing-in__form-label" htmlFor="password">
          Password:
          <input
            id="password"
            type="password"
            value={password}
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            maxLength={32}
          />
        </label>
        <label className="sing-in__form-label-checkbox" htmlFor="checkbox">
          Remember me:
          <input
            id="checkbox"
            type="checkbox"
            value={isRemember}
            onChange={(e) => setIsRemember(e.target.value)}
          />
        </label>

        <button type="submit" onClick={handleReset}>
          Sign in
        </button>
      </form>

      <Link to="/" className="sing-in__link">Forgot Password?</Link>

      <Link to="/sign-up" className="sing-in__link">Don`t have an account? Sign Up</Link>

      {/* <div className="sing-in__or">
        <div className="sing-in__or-line"></div>
        Or
        <div className="sing-in__or-line"></div>
      </div> */}

      {/* <div className="sing-in__google">Continue with Google</div>

      <div className="sing-in__facebook">Continue with Facebook</div> */}
    </div>
  );
};
