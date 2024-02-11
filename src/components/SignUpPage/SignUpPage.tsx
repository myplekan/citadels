import { Link } from "react-router-dom";
import "./SignUpPage.css";
import { useState } from "react";
import { useNavigate } from "react-router";
import avatarsData from "../../avatars.json";
import { useAppDispatch } from "../../hooks/hooks";
import { actions } from "../../features/personsSlice";

export const SignUpPage = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [isAvatar, setIsAvatar] = useState(false);
  const navigate = useNavigate();
  
  const dispatch = useAppDispatch();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!login || !password || !name || !avatar) {
      return;
    }

    navigate("/");

    const person = {
      id: "3",
      name,
      avatar,
      character: { 
        photo: "",
        moveQueue: null,
        name: "",
        type: "none"
      },
      money: 0,
      cards: [],
      builds: [],
    }

    dispatch(actions.createPerson(person));

    handleReset();
  };

  const handleReset = () => {
    setLogin("");
    setPassword("");
    setName("");
    setAvatar("");
  };

  return (
    <div className="sing-up">
      <div className="sing-up__container">
        <h1 className="sing-up__title">Create New Account</h1>

        <form
          className="sing-up__form"
          action=""
          method="POST"
          onSubmit={handleSubmit}
        >
          <label className="sing-up__form-label" htmlFor="name">
            Name:
            <input
              id="name"
              type="text"
              value={name}
              placeholder="Enter you name"
              onChange={(e) => setName(e.target.value)}
            />
          </label>

          <label className="sing-up__form-label" htmlFor="login">
            Login:
            <input
              id="login"
              type="email"
              value={login}
              placeholder="Enter you email"
              onChange={(e) => setLogin(e.target.value)}
            />
          </label>

          <label className="sing-up__form-label" htmlFor="password">
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

          <button type="button" onClick={() => setIsAvatar(true)}>
            Choose Avatar
          </button>

          <button type="submit">
            Create Account
          </button>
        </form>

        <Link to="/sign-in" className="sing-in__link">
          Already have an account? Sign In
        </Link>
      </div>

      {isAvatar && (
        <div className="sign-up__choose-avatars">
          {avatarsData.avatars.map((avatar) => (
            <img
              key={avatar.id}
              src={`${process.env.PUBLIC_URL}/images/persons/${avatar.src}`}
              alt={avatar.name}
              className="sign-up__choose-avatar"
              onClick={() => {
                setIsAvatar(false);
                setAvatar(avatar.src)
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};
