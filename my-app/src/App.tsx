import { Routes } from "react-router-dom";
import "./App.css";
import React from "react";
import RFButtonStack from "./components/Molecules/RFButtonStack";

function App() {
  const buttonStack = RFButtonStack("Menu", "Reservations");

  return (
    <>
      <Routes />
      <h1>
        <img
          src="https://logonoid.com/images/roger-federer-logo.png"
          style={{ width: "200px", height: "auto" }}
        />
        <p>Welcome to Rest Foods!</p>
      </h1>
      {buttonStack}
    </>
  );
}

export default App;
