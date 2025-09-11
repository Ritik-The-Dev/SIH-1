import './i18n';
import Home from "./pages/home";
import Login from "./pages/login";
import SignUp from "./pages/signup";
import Profile from "./pages/profile";
import Favourite from "./pages/favourites";
import Navigation from "./components/navbar";
import MyApplications from "./pages/myApplications";
import { Routes, Route, useLocation } from "react-router-dom";

export default function App() {
  const location = useLocation();
  const hideNav = ["/login", "/signup"].includes(location.pathname);
  return (
    <>
       {!hideNav && <Navigation />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/favourites" element={<Favourite />} />
        <Route path="/applications" element={<MyApplications />} />
      </Routes>
    </>
  );
}