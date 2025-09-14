import './i18n';
import Home from "./pages/home";
import Login from "./pages/login";
import SignUp from "./pages/signup";
import Profile from "./pages/profile";
import Navigation from "./components/navbar";
import MyApplications from "./pages/myApplications";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useSetRecoilState } from 'recoil';
import { userState } from './store/profile';
import { useEffect } from 'react';
import { getProfileApi } from './services/api';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const setUser = useSetRecoilState(userState);
  const hideNav = ["/login", "/signup"].includes(location.pathname);

  const getUserProfile = async () => {
    try {
      const data = await getProfileApi();
      if (data && data?.success) {
        setUser(data?.user)
      } else {
        const isAuthPage = ["/login", "/signup"].includes(location.pathname);
        if (!isAuthPage) {
          navigate('/login')
        }
      }
    } catch (err) {
      console.log('Error Blocked Reached', err)
      const isAuthPage = ["/login", "/signup"].includes(location.pathname);
      if (!isAuthPage) {
        navigate('/login')
      }
    }
  }

  useEffect(() => {
    getUserProfile();
  }, []);

  return (
    <>
      {!hideNav && <Navigation />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/applications" element={<MyApplications />} />
      </Routes>
    </>
  );
}