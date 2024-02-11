import "./App.css";
import { Route, Routes } from "react-router-dom";
// import { Footer } from "./components/Footer/Footer";
import { Header } from "./components/Header/Header";

import { SignInPage } from "./components/SignInPage/SignInPage";
import { SignUpPage } from "./components/SignUpPage/SignUpPage";
import { HomePage } from "./components/HomePage/HomePage";

function App() {
  return (
    <div className="App">
      <Header />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
      </Routes>

      {/* <Footer /> */}
    </div>
  );
}

export default App;
