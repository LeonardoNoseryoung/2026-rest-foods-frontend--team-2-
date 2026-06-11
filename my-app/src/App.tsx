import { Route, Routes } from "react-router-dom";
import MainPage from "./Pages/MainPage";
import MenuPage from "./Pages/MenuPage";
import ReservationPage from "./Pages/ReservationPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/reservation" element={<ReservationPage />} />

      </Routes>
    </>
  );
}

export default App;
