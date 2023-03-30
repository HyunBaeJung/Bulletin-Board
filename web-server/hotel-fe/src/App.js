import { Outlet, Route, Routes } from "react-router-dom";
import "./App.css";
import Footer from "./components/Footer";
import NavBar from "./components/NavBar";
import MainPage from "./components/pages/MainPage";
import SignIn from "./components/pages/SignIn";
import SignUp from "./components/pages/SignUp";

const Layout = () => {
  return (
    <div>
      <NavBar />

      <Outlet />

      <Footer />
    </div>
  );
};

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<MainPage />} />
        </Route>
        <Route path="/SignIn" element={<SignIn />} />
        <Route path="/Signup" element={<SignUp />} />
      </Routes>
    </div>
  );
}

export default App;
