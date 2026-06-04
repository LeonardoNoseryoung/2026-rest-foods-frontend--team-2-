import { useNavigate, Route, Routes } from "react-router-dom";
import "./App.css";
import React from "react";
import MainPage from "./Pages/MainPage";

function App() {
  const navigate = useNavigate();
  const goToHome = () => {
    navigate("/");
  };
  return (
    goToHome(),
    <>
      <Routes>
        <Route path="/" element={<MainPage />} />
      </Routes>
    </>
  );
}

export default App;
