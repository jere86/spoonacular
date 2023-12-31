import { Route, Routes } from "react-router-dom";

import Home from "./pages/Home/Home";
import Search from "./pages/Search/Search";
import Info from "./pages/Info/Info";
import Favorites from "./pages/Favorites/Favorites";
import Login from "./components/Login/Login";
import Navbar from "./components/Navbar/Navbar";
import Signup from "./components/Signup/Signup";
import MealPlanner from "./pages/MealPlanner/MealPlanner";
import ShopingList from "./pages/ShopingList/ShopingList";
import Community from "./pages/Community/Community";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Signup />} />
      <Route
        path="/home"
        element={
          <>
            <Navbar />
            <Home />
          </>
        }
      />
      <Route
        path="/search"
        element={
          <>
            <Navbar />
            <Search />
          </>
        }
      />
      <Route
        path="/info/:id"
        element={
          <>
            <Navbar />
            <Info />
          </>
        }
      />
      <Route
        path="/favorites"
        element={
          <>
            <Navbar />
            <Favorites />
          </>
        }
      />
      <Route
        path="/mealplanner"
        element={
          <>
            <Navbar />
            <MealPlanner />
          </>
        }
      />
      <Route
        path="/shopinglist"
        element={
          <>
            <Navbar />
            <ShopingList />
          </>
        }
      />
      <Route
        path="/community"
        element={
          <>
            <Navbar />
            <Community />
          </>
        }
      />
    </Routes>
  );
}
