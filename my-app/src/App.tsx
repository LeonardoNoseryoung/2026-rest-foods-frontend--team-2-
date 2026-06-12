import { Route, Routes } from "react-router-dom";
import MainPage from "./Pages/MainPage";
import MenuPage from "./Pages/MenuPage";
import ReservationPage from "./Pages/ReservationPage";
import TableDetailPage from "./Pages/TableDetailPage";



function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/reservation" element={<ReservationPage />} />
        <Route path="/tables/:tableId" element={<TableDetailPage />} />


      </Routes>
    </>
  );
}

export default App;
