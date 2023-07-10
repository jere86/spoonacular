import { Route, Routes } from "react-router-dom";
import { v4 } from "uuid";

import Home from "./pages/Home/Home";
import Search from "./pages/Search/Search";
import Info from "./pages/Info/Info";
import Favorites from "./pages/Favorites/Favorites";
import Login from "./components/Login/Login";
import Navbar from "./components/Navbar/Navbar";
import Signup from "./components/Signup/Signup";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/home"
        element={[<Navbar key={v4()} />, <Home key={v4()} />]}
      />
      <Route
        path="/search"
        element={[<Navbar key={v4()} />, <Search key={v4()} />]}
      />
      <Route
        path="/info/:id"
        element={[<Navbar key={v4()} />, <Info key={v4()} />]}
      />
      <Route
        path="/favorites"
        element={[<Navbar key={v4()} />, <Favorites key={v4()} />]}
      />
    </Routes>
  );
}
