import { Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/Login";
import MainPage from "./components/Mainpage";

const Management = () => {
  return (
    <>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route exact path="/mainpage" element={<MainPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

export default Management;
