import { Route, Routes } from "react-router-dom";

import "./App.scss";

import Index from "./pages/Index/Index";
import Search from "./pages/Search/Search";
import Info from "./pages/Info/Info";
import Favorites from "./pages/Favorites/Favorites";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/search" element={<Search />} />
      <Route path="/info" element={<Info />} />
      <Route path="/favorites" element={<Favorites />} />
    </Routes>
  );
}
