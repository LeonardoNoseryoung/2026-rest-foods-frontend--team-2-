import { Route, Routes } from "react-router-dom";
import MainPage from "./Pages/MainPage";
import MenuPage from "./Pages/MenuPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/menu" element={<MenuPage />} />
      </Routes>
    </>
  );
}

export default App;
